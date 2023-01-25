import {
  BodyLayout,
  Button,
  Card,
  FlexLayout,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (
    <BodyLayout>
      <Card>
        <FlexLayout
          direction="vertical"
          valign="center"
          halign="center"
          spacing="extraLoose"
        >
          <TextStyles type="Heading" alignment="center">
            404
          </TextStyles>
          <TextStyles>Something went wrong! Please go back to home.</TextStyles>
          <Link to="/auth/login">
            <Button>Home</Button>
          </Link>
        </FlexLayout>
      </Card>
    </BodyLayout>
  );
}

export default ErrorPage;
