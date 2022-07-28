import { CSSNode } from "../css/ast";
import { SQSSVisitor } from "../visitor";

class SQSSToCSSTransformer implements SQSSVisitor<CSSNode, null> {}
