import { format, parseISO } from "date-fns";
import pt from "date-fns/locale/pt";
import Mail from "../../lib/Mail";

class JoinMail {
  get key() {
    return "JoinMail";
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: "Novo participante para o encontro!",
      template: "join",
      context: {
        organizer: meetup.User.name,
        meetup: meetup.title,
        date: format(parseISO(meetup.date), "dd 'de' MMMM',às ' H:mm'h'", {
          locale: pt
        }),
        user: user.name,
        email: user.email
      }
    });
  }
}

export default new JoinMail();
