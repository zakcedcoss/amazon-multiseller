import { BodyLayout, Button, Card, FlexLayout, FormElement, Select, TextField, Toast, ToastWrapper } from "@cedcommerce/ounce-ui";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN } from "../environments/utils";
import { passwordValidator, usernameValidator } from "../validator/inputValidator";

interface InputType {
  username: string;
  password: string;
  option: string;
}

function Auth() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<InputType>({ username: "", password: "", option: "demo" });
  const [errorMessages, setErrorMessages] = useState<{ [key: string]: [boolean, string] }>({});
  const [errors, setErrors] = useState<{ active: boolean; message: string }>({ active: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  async function postRequest() {
    setIsLoading(true)
    const response = await fetch("https://multi-account.sellernext.com/home/public/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ "target_marketplace": "all", "username": inputs.username, "password": inputs.password })
    })
    const fetchedData = await response.json();
    if (fetchedData) {
      if (fetchedData.success) {
        try {
          const token = fetchedData.data.token;
          sessionStorage.setItem("token", token)
          setErrors({ active: false, message: "" });
          setIsLoading(false);
          navigate("/panel/dashboard", { replace: true })
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          setErrors({ active: true, message: "Something went wrong. Please try again." });
        }
      } else {
        setIsLoading(false);
        setErrors({ active: true, message: "Username does not exists !!!" });
      }
    }
  }

  useEffect(() => {
    setInputs({ username: "", password: "", option: "demo" });
    setErrorMessages({});
    setErrors({ active: false, message: "" });
  }, []);

  const handleChange = (value: string, name: string) => {
    if (name === "username") {
      const errMsg = usernameValidator(value);
      setErrorMessages({ ...errorMessages, username: [errMsg.active, errMsg.message] });
    }
    if (name === "password") {
      const errMsg = passwordValidator(value);
      setErrorMessages({ ...errorMessages, password: [errMsg.active, errMsg.message] });
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

    postRequest();
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
                <Button loading={isLoading} length="fullBtn" onClick={handleSubmit}>Login</Button>
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
