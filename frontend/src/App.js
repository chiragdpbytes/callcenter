import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import { useImmer } from "use-immer";
import axios from "./utils/Axios";
import socket from "./utils/SocketIo";
import CallCenter from "./components/CallCenter";
import useTokenFromLocalStorage from "./hooks/useTokenFromLocalStorage";
import * as Twilio from "twilio-client";

function App() {
  const [calls, setCalls] = useImmer({
    calls: [],
  });
  console.log("App.js calls =>", calls);

  const [user, setUser] = useImmer({
    username: "",
    mobileNumber: "",
    verificationCode: "",
    verificationSent: false,
  });
  const [twilioToken, setTwilioToken] = useState();

  const [storedToken, setStoredToken, isValidToken] =
    useTokenFromLocalStorage(null);

  useEffect(() => {
    console.log("Twilio token changed");
    if (twilioToken) {
      connectTwilioVoiceClient(twilioToken);
    }
  }, [twilioToken]);

  useEffect(() => {
    if (isValidToken) {
      console.log("Valid token");
      return socket.addToken(storedToken);
    }
    console.log("Invalid token");
    socket.removeToken();
  }, [isValidToken, storedToken]);

  useEffect(() => {
    socket.client.on("connect", () => {
      console.log("Connected");
    });
    socket.client.on("disconnect", () => {
      console.log("Socket disconnected");
    });
    socket.client.on("twilio-token", (data) => {
      console.log("Receive Token from the backend");
      setTwilioToken(data.token);
    });
    socket.client.on("call-new", ({ data: { CallSid, CallStatus } }) => {
      // debugger;
      console.log(
        "call-new-CallSid",
        CallSid,
        " ::::: call-new-CallStatus",
        CallStatus
      );
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          (call) => call?.CallSid === CallSid
        );
        console.log("call-new index", index);
        if (index === -1) {
          draft.calls.push({ CallSid, CallStatus });
        }
      });
    });

    socket.client.on("enqueue", ({ data: { CallSid } }) => {
      // debugger;
      console.log("enqueue CallSid", CallSid);
      setCalls((draft) => {
        const index = draft.calls.findIndex(
          (call) => call?.CallSid === CallSid
        );
        console.log("enqueue index", index, "::: enqueue draft", draft);
        if (index === -1) {
          return;
        }
        draft.calls[index].CallStatus = "enqueue";
      });
    });

    // const token = localStorage.getItem("Token:");
    // if (token) {
    //   setStoredToken(token);
    // }

    return () => {};
  }, [setCalls, socket.client]);

  async function sendSmsCode() {
    console.log("Sending SMS");
    try {
      await axios.post("/login", {
        to: user.mobileNumber,
        username: user.username,
        channel: "sms",
      });

      setUser((draft) => {
        draft.verificationSent = true;
      });
      console.log("Verification SMS sent");
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  }

  function connectTwilioVoiceClient(twilioToken) {
    const device = new Twilio.Device(twilioToken, { debug: true });
    device.on("error", (error) => {
      console.error(error);
    });
    device.on("incoming", (connection) => {
      console.log("Incoming from twilio");
      connection.accept();
    });
  }

  async function sendVerificationCode() {
    console.log("Verifind Code");
    try {
      const response = await axios.post("/verify", {
        to: user.mobileNumber,
        code: user.verificationCode,
        username: user.username,
      });

      console.log("received token", response.data.token);
      setStoredToken(response.data.token);
    } catch (error) {
      console.error("Error verifying code:", error);
    }
  }
  console.log("twilioToken =>", twilioToken);

  return (
    <div>
      {isValidToken ? (
        <CallCenter calls={calls} />
      ) : (
        <>
          <CallCenter calls={calls} />
          <Login
            user={user}
            setUser={setUser}
            sendSmsCode={sendSmsCode}
            sendVerificationCode={sendVerificationCode}
          />
        </>
      )}
      {calls.calls.map((call, index) =>
        call && call.CallSid ? (
          <h1 key={index}>{call.CallSid}</h1>
        ) : (
          <h1>null</h1>
        )
      )}
    </div>
  );
}

export default App;
