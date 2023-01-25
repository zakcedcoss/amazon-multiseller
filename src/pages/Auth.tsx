import {
  BodyLayout,
  Button,
  Card,
  FlexLayout,
  FormElement,
  Select,
  TextField,
  Toast,
  ToastWrapper,
} from "@cedcommerce/ounce-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, TOKEN } from "../environments/utils";
import usePostRequests from "../hooks/postRequests";
import {
  passwordValidator,
  usernameValidator,
} from "../validator/inputValidator";

interface InputType {
  username: string;
  password: string;
  option: string;
}

function Auth() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<InputType>({
    username: "",
    password: "",
    option: "demo"
  });
  const [errorMessages, setErrorMessages] = useState<{
    [key: string]: [boolean, string];
  }>({});
  const [errors, setErrors] = useState<{ active: boolean; message: string }>({
    active: false,
    message: "",
  });
  // auth
  const [isAuth, setIsAuth] = useState(false);


  if (isAuth) {
    navigate("/panel/dashboard", { replace: true });
  }


  async function postRequest(url: string, bodyData: any) {
    const response = await fetch(BASE_URL + url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ ...bodyData })
    })
    const fetchedData = await response.json();
    if (fetchedData) {
      if (fetchedData.success) {
        setIsAuth(true)
      }
    } else {
      // handle error
    }
  }

  // useEffect(() => {
  //   setInputs({
  //     username: "",
  //     password: "",
  //     option: "demo"
  //   });
  //   setErrorMessages({});
  //   setErrors({
  //     active: false,
  //     message: "",
  //   });
  // }, [auth]);

  const handleChange = (value: string, name: string) => {
    if (name === "username") {
      const errMsg = usernameValidator(value);
      setErrorMessages({
        ...errorMessages,
        username: [errMsg.active, errMsg.message],
      });
    }
    if (name === "password") {
      const errMsg = passwordValidator(value);
      setErrorMessages({
        ...errorMessages,
        password: [errMsg.active, errMsg.message],
      });
    }

    setInputs({ ...inputs, [name]: value.toLocaleLowerCase() });
  };

  const handleSubmit = () => {
    if (!inputs?.username || !inputs?.password) {
      setErrors({ active: true, message: "Fill all the fields" });
      return;
    }
    if (errorMessages.username[0] || errorMessages.password[0]) {
      setErrors({ active: true, message: "Input Vaidation failed!" });
      return;
    }

    // const authData = postRequest("/user/login", {
    //   target_marketplace: "all",
    //   username: inputs?.username,
    //   password: inputs?.password
    // });

    // if(authData.success) {
    //   setIsAuth(true)
    // } else {
    //   setIsAuth(false)
    // }
  };

  return (
    <BodyLayout>
      <FlexLayout valign="center" direction="vertical">
        <div
          style={{
            width: 450,
            margin: "auto",
          }}
        >
          <Card
            cardType="Shadowed"
            title={"LOGIN"}
          >
            <FormElement>
              <FlexLayout
                desktopWidth="100"
                mobileWidth="100"
                spacing="loose"
                tabWidth="100"
                direction="vertical"
              >
                <Select
                  value={inputs?.option}
                  options={[
                    { label: "Home", value: "home" },
                    { label: "Amazon Demo", value: "demo" },
                  ]}
                  onChange={(e) => {
                    setInputs(prev => {
                      return { ...prev, option: e }
                    })
                  }}
                />
                <TextField
                  error={
                    errorMessages?.username ? errorMessages?.username[0] : false
                  }
                  showHelp={
                    errorMessages?.username ? errorMessages?.username[1] : ""
                  }
                  autocomplete="off"
                  name="Username"
                  onChange={(e) => handleChange(e, "username")}
                  placeHolder="Enter Username"
                  type="text"
                  value={inputs.username}
                />
                <TextField
                  error={
                    errorMessages?.password
                      ? errorMessages?.password[0]
                      : false
                  }
                  showHelp={
                    errorMessages?.password ? errorMessages?.password[1] : ""
                  }
                  autocomplete="off"
                  name="Password"
                  onChange={(e) => handleChange(e, "password")}
                  placeHolder="Enter Password"
                  type="password"
                  value={inputs.password}
                />
                <hr />
                <Button length="fullBtn" onClick={handleSubmit}>Login</Button>
              </FlexLayout>
            </FormElement>
          </Card>
        </div>
      </FlexLayout>
      {errors?.active && (
        <ToastWrapper>
          <Toast
            message={errors.message}
            type="error"
            onDismiss={() => setErrors({ active: false, message: "" })}
            timeout={3000}
          />
        </ToastWrapper>
      )}

    </BodyLayout>
  );
}

export default Auth;
