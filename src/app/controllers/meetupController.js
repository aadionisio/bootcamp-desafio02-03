// import { identity } from "rxjs";
import * as Yup from "yup";
import {
  startOfHour,
  parseISO,
  isBefore,
  startOfDay,
  endOfDay
} from "date-fns";
import { Op } from "sequelize";
import User from "../models/User";
import Meetup from "../models/Meetup";
import File from "../models/File";

class MeetupController {
  async store(req, res) {
    // Validando os dados de entrada

    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string()
        .required()
        .min(20),
      location: Yup.string().required(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      file_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails", ret: req.body });
    }

    const { date } = req.body;
    // Validando se a data enviada é uma data presente ou futura. caso seja uma data passada bloquear
    const dateStart = startOfHour(parseISO(date));

    if (isBefore(dateStart, new Date())) {
      return res.status(400).json({ error: "Past dates are not permited!" });
    }

    // criando o evento
    const meetup = await Meetup.create(req.body);

    return res.json(meetup);
  }

  // metodo para alterar os dados do usuario

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().min(20),
      location: Yup.string(),
      date: Yup.date().required(),
      user_id: Yup.number().required(),
      file_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails" });
    }

    const { id } = req.params;

    // localizando o meetup no banco

    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(401).json({ error: "meetup not found." });
    }

    const { user_id: idorganizer, date } = meetup;

    // verificando se o ID que está sendo enviado é o mesmo que está na base de dados

    if (idorganizer !== req.userid) {
      return res
        .status(401)
        .json({ error: "Update Failed! User is not organizer of meetup." });
    }
    // validando a data do meetup

    // verificar se a data do meetup selecionado é maior que hoje (encontro nao aconteceu).

    if (isBefore(date, new Date())) {
      return res
        .status(400)
        .json({ error: "Changes available for unrealized meetings only." });
    }

    // Validando se a data enviada é uma data presente ou futura. caso seja uma data passada bloquear
    const { date: dateupdated } = req.body;

    const dateStartUpd = startOfHour(parseISO(dateupdated));

    if (isBefore(dateStartUpd, new Date())) {
      return res.status(400).json({ error: "Past dates are not permited!" });
    }

    // alterando os dados do meetup no banco

    const { title, description } = await meetup.update(req.body);

    return res.json({
      meetup: { id, title, description }
    });
  }

  async index(req, res) {
    if (!req.userid) {
      return res.status(401).json({ error: "User not sended." });
    }

    const user = await User.findOne({
      where: { id: req.userid }
    });

    if (!user) {
      return res.status(401).json({ error: "user not found!" });
    }

    const page = req.query.page || 1;

    if (!req.query.date) {
      return res.status(401).json({ error: "search date not sent" });
    }

    const searchDate = parseISO(req.query.date);

    const meetup = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
        }
      },
      attributes: ["title", "date", "description", "location"],

      include: [
        {
          model: File,
          attributes: ["id", "path"]
        },
        {
          model: User,
          attributes: ["id", "name", "email"]
        }
      ],
      limit: 10,
      offset: 10 * page - 10
    });

    if (!meetup) {
      return res.status(401).json({ error: "meetup not found." });
    }

    return res.json(meetup);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(401).json({ error: "meetup not found." });
    }

    if (meetup.user_id !== req.userid) {
      return res
        .status(401)
        .json({ error: "You don't have permission to cancel a meetup." });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "Cancellation available only for unrealized meetings.."
      });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupController();
