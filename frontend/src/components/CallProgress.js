import React from "react";
import { Container } from "semantic-ui-react";
import socket from "../utils/SocketIo";

function CallProgress({ call }) {
  console.log("call =>", call);
  function answerCall(sid) {
    socket.client.emit("answer-call", sid);
  }
  return (
    <Container>
      <div class="ui steps fluid">
        <div
          class={`${call.CallStatus === "ringing" ? "active" : ""} 
          ${call.CallStatus !== "ringing" ? "completed" : ""} step`}
        >
          <i class="phone icon"></i>
          <div class="content">
            <div class="title">Ringing</div>
            <div class="description">{call.CallSid}</div>
          </div>
        </div>
        <div
          class={`${call.CallStatus === "enqueue" ? "active" : ""}
        ${call.CallStatus === "ringing" ? "disabled" : ""} step`}
          onClick={() => answerCall(call.CallSid)}
        >
          <i class="cogs icon"></i>
          <div class="content">
            <div class="title">In queue</div>
            <div class="description">User waiting in queue</div>
          </div>
        </div>
        <div
          class={`${
            call.CallStatus === "ringing" || call.CallStatus === "enqueue"
              ? "disabled"
              : ""
          } step`}
        >
          <i class="headphones icon"></i>
          <div class="content">
            <div class="title">Answered</div>
            <div class="description">Answer by John</div>
          </div>
        </div>
        <div class="step">
          <i class="times icon"></i>
          <div class="content">
            <div class="title">Hang up</div>
            <div class="description">Missed call</div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CallProgress;
