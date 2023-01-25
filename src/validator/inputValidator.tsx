function nameValidator(name: string) {
  const nameRegex = /^[A-Za-z]{1,30}$/;
  if (name === "") return { active: true, message: "Name should not be empty" };
  if (!nameRegex.test(name)) {
    return {
      active: true,
      message: "Name should not contain number or special character or spaces",
    };
  }
  return { active: false, message: "" };
}

function usernameValidator(username: string) {
  const usernameRegex = /^[A-Za-z]*[@\-_]*?[A-Za-z0-9]+$/;
  if (username === "")
    return { active: true, message: "Username should not be empty" };
  if (!usernameRegex.test(username)) {
    return {
      active: true,
      message:
        "Username must starts and ends with a letter (Special characters allowed are @,-,_",
    };
  }
  return { active: false, message: "" };
}

function emailValidator(email: string) {
  const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (email === "") return { active: true, message: "Email must not be empty" };
  if (!emailRegex.test(email)) {
    return {
      active: true,
      message: "Email must follow the specific email pattern. Eg: abc@xyz.com",
    };
  }
  return { active: false, message: "" };
}

function passwordValidator(password: string) {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*\d).{6,}$/;
  if (password === "")
    return { active: true, message: "Password must not be empty" };
  if (!passwordRegex.test(password)) {
    return {
      active: true,
      message:
        "Password must be atleast 6 characters long and contains special characters like !@#$%^&*",
    };
  }
  return { active: false, message: "" };
}

export { nameValidator, usernameValidator, emailValidator, passwordValidator };
