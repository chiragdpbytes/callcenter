import React from "react";
import {
  Button,
  Form,
  FormInput,
  Grid,
  GridColumn,
  Header,
  Segment,
} from "semantic-ui-react";

const Login = ({
  user: { username, mobileNumber, verificationCode, verificationSent },
  setUser,
  sendSmsCode,
  sendVerificationCode,
}) => {
  function populateFields(event, data) {
    setUser((draft) => {
      draft[data.name] = data.value;
    });
  }

  return (
    <Grid textAlign="center" verticalAlign="middle" style={{ height: "100vh" }}>
      <GridColumn style={{ maxWidth: 450 }}>
        <Header color="teal" textAlign="center">
          Login Account
        </Header>
        <Form>
          <Segment>
            <FormInput
              fluid
              icon="user"
              iconPosition="left"
              placeholder="UserName"
              value={username}
              onChange={(event, data) => populateFields(event, data)}
              name="username"
            />
            <FormInput
              fluid
              icon="mobile alternate"
              iconPosition="left"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={(event, data) => populateFields(event, data)}
              name="mobileNumber"
            />
            {verificationSent && (
              <FormInput
                fluid
                icon="key"
                iconPosition="left"
                placeholder="Enter your code"
                value={verificationCode}
                onChange={(event, data) => populateFields(event, data)}
                name="verificationCode"
              />
            )}
            <Button
              fluid
              color="teal"
              size="large"
              onClick={!verificationSent ? sendSmsCode : sendVerificationCode}
            >
              {!verificationSent ? "Login/SignUp" : "Enter your code"}
            </Button>
          </Segment>
        </Form>
      </GridColumn>
    </Grid>
  );
};

export default Login;
