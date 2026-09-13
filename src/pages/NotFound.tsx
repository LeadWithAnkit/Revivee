import { Link } from "react-router-dom";
export default function NotFound(){return <div className="page center-page"><span className="eyebrow">404</span><h1>That page isn't here.</h1><p>Let's get you back to the next useful thing.</p><Link className="btn btn-primary" to="/">Back to Today</Link></div>}
