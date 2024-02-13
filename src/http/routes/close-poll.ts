import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";

export async function closePoll(app: FastifyInstance) {
  app.patch("/polls/:pollId/close", async (request, reply) => {
    const closePollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = closePollParams.parse(request.params);

    try {
      const poll = await prisma.poll.update({
        where: {
          id: pollId,
          open: true,
        },

        data: {
          open: false,
        },
      });
    } catch (RecordNotFound) {
      const pollExists = await prisma.poll.findUnique({
        where: { id: pollId },
      });

      if (!pollExists) {
        return reply.status(404).send({ errorMessage: "Poll not found" });
      }

      return reply
        .status(400)
        .send({ pollId, errorMessage: "This poll is already closed." });
    }


    return reply.status(200).send({ pollId, message: "Poll closed." });
  });
}
