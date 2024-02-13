import fastify from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";
import cookie from "@fastify/cookie";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import websocket from "@fastify/websocket";
import { pollResults } from "./ws/poll-results";
import { closePoll } from "./routes/close-poll";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-nlw",
  hook: "onRequest",
});

app.register(websocket)

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);
app.register(closePoll)

app.register(pollResults)

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running");
});
