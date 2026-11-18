import { Link } from "react-router-dom";
import * as ui from "../ui";

export default function NotFoundPage() {
  return (
    <div className={ui.centerScreen}>
      <div className={`${ui.panel} ${ui.authCard} ${ui.stack}`}>
        <h1 className={ui.h1}>404</h1>
        <p className={ui.p}>This path leads only into the void.</p>
        <Link to="/" className={ui.button()}>
          Return home
        </Link>
      </div>
    </div>
  );
}
