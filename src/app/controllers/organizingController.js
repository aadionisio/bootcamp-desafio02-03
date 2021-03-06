import Meetup from "../models/Meetup";

class OrganizingController {
  async index(req, res) {
    const meetups = await Meetup.findAll({ where: { user_id: req.userid } });

    return res.json(meetups);
  }
}

export default new OrganizingController();
