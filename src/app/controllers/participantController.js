// import { identity } from "rxjs";
import * as Yup from "yup";
import { isBefore, startOfHour, endOfHour } from "date-fns";
import { Op } from "sequelize";
import User from "../models/User";
import Meetup from "../models/Meetup";
import Participant from "../models/Participants";
import Notification from "../schemas/notification";

import Queue from "../../lib/Queue";
import JoinMail from "../jobs/JoinMail";

class ParticipantController {
  async store(req, res) {
    // Validando os dados de entrada

    const schema = Yup.object().shape({
      meetup_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Validation Fails", ret: req.body });
    }

    console.log("Val 1");

    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [User]
    });

    if (!meetup) {
      return res.status(401).json({ error: "meetup not found." });
    }

    const user = await User.findByPk(req.userid);

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    console.log("Val 2");
    if (meetup.user_id === req.userid) {
      return res.status(401).json({
        error: "Invalid Request!!! You are the organizer of this meeting!"
      });
    }
    console.log("Val 3");
    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: "registration available for unrealized meetings only.."
      });
    }
    console.log("Val 4");
    console.log(meetup.meetup_id);
    const checkuser = await Participant.findOne({
      where: { user_id: req.userid, meetup_id: meetup.id }
    });

    if (checkuser) {
      return res.status(401).json({
        error:
          "Invalid Request! Participant is registered in the desired meeting!"
      });
    }
    console.log("Val 5");
    // Validar se o participante esta em outro meetup no mesmo horario (hora)

    const checkparticipant = await Participant.findOne({
      where: {
        user_id: req.userid
      },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: {
              [Op.between]: [startOfHour(meetup.date), endOfHour(meetup.date)]
            }
          }
        }
      ]
    });

    if (checkparticipant) {
      return res.status(401).json({
        error:
          "Participant is already registered for another meeting on the selected date."
      });
    }
    console.log("add participante");
    const participant = await Participant.create({
      dtjoin: new Date(),
      meetup_id: req.body.meetup_id,
      user_id: req.userid
    });

    /**
     * Notificar Organizador do encontro
     */

    await Notification.create({
      content: `Olá ${meetup.User.name}! O participante ${user.name} acaba de se increver no encontro ${meetup.title} organizado por você! `,
      user: meetup.user_id
    });

    await Queue.add(JoinMail.key, { meetup, user });

    return res.json(participant);
  }

  // metodo para listar as incrições de um participante

  async index(req, res) {
    const meets = await Participant.findAll({
      where: {
        user_id: req.userid
      },
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date()
            }
          },
          required: true
        }
      ],
      order: [[Meetup, "date"]]
    });

    return res.json(meets);
  }
}

export default new ParticipantController();
