require("dotenv").config();

const twilio = require("twilio");
const VoiceResponse = require("twilio/lib/twiml/VoiceResponse");

class Twilio {
  phoneNumber = process.env.MOBILE;
  phoneNumberSid = process.env.PHONE_NUMBER_SID;
  tokenSid = process.env.TWILIO_TOKEN_SID;
  tokenSecret = process.env.TWILIO_TOKEN_SECRET;
  accountSid = process.env.TWILIO_ACCOUNT_SID;
  verify = process.env.TWILIO_VERIFY_SERVICE_SID;
  outgoingApplicationSid = process.env.TWILIO_OUTGOING_APPLICATION_SID;
  client;
  constructor() {
    this.client = twilio(this.tokenSid, this.tokenSecret, {
      accountSid: this.accountSid,
    });
  }

  getTwilio() {
    this.client;
  }

  async sendVerifyAsync(to, channel) {
    const data = await this.client.verify.v2
      .services(this.verify)
      .verifications.create({
        to,
        channel,
      });
    console.log("sendVerify:", data);
    return data;
  }

  async verifyCodeAsync(to, code) {
    const data = await this.client.verify.v2
      .services(this.verify)
      .verificationChecks.create({
        to,
        code,
      });
    console.log("verify code", data);
    return data;
  }

  voiceResponse(message) {
    const twiml = new VoiceResponse();
    twiml.say(
      {
        voice: "female",
      },
      message
    );
    twiml.redirect("https://trady-callcenter.loca.lt/enqueue");
    return twiml;
  }

  enqueueCall(queueName) {
    const twiml = new VoiceResponse();
    twiml.enqueue(queueName);
    return twiml;
  }

  redirectCall(client) {
    const twiml = new VoiceResponse();
    twiml.dial().client(client);
    return twiml;
  }

  answerCall(sid) {
    if (typeof sid !== "string") {
      console.error("Invalid SID type:", typeof sid);
      return;
    }
    console.log("answerCall with sid", sid);
    this.client.calls(sid).update(
      {
        url: "https://trady-callcenter.loca.lt/connect-call",
        method: "POST",
      },
      (err, call) => {
        if (err) {
          console.error("answerCall", err);
        } else {
          console.log("AnswerCall", call);
        }
      }
    );
  }

  getAccessTokenForVoice = (identity) => {
    console.log(`Access token for ${identity}`);
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;
    const outgoingAppSid = this.outgoingApplicationSid;
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: outgoingAppSid,
      incomingAllow: true,
    });
    const token = new AccessToken(
      this.accountSid,
      this.tokenSid,
      this.tokenSecret,
      { identity }
    );
    token.addGrant(voiceGrant);
    console.log("Access granted with JWT", token.toJwt());
    return token.toJwt();
  };
}

const instance = new Twilio();
Object.freeze(instance);

module.exports = instance;
