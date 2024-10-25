import { foo, compose } from "./index.module.css";

const div = document.createElement("div");

div.className = foo + " " + compose;

document.body.append(div);
