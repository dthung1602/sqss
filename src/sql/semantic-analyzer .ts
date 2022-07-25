/* eslint-disable @typescript-eslint/no-empty-function */
import {
    assertEqual,
    assertTrue,
    isAttrSelector,
    isBool,
    isKebabCase,
    isPseudoClassSelector,
    isPseudoElementSelector,
    isSimpleSelector,
    isString,
} from "../utils";
import { Agg, SQSSVisitor } from "../visitor";
import {
    AndCondition,
    Condition,
    EqualCondition,
    IsCondition,
    LikeCondition,
    OrCondition,
    SqssNode,
    SqssStyleSheet,
    StyleAssignment,
    UpdateStatement,
} from "./ast";

export default class Transverser {
    constructor(public sqssStyleSheet: SqssStyleSheet) {}

    transverse() {
        for (const update of this.sqssStyleSheet.updates) {
            this.transverseUpdateStatement(update);
        }
    }

    private transverseUpdateStatement(update: UpdateStatement) {
        this.transverseTable(update.table);
        for (const assignment of update.assignments) {
            this.transverseStyleAssignment(assignment);
        }
        this.transverseCondition(update.where);
    }

    private transverseTable(table: string) {
        assertEqual(table, "styles");
    }

    private transverseStyleAssignment(assignment: StyleAssignment) {
        assertEqual(isKebabCase(assignment.property), true);
    }

    private transverseCondition(condition: Condition | null) {
        if (condition instanceof AndCondition) this.transverseAndCondition(condition);
        else if (condition instanceof OrCondition) this.transverseOrCondition(condition);
        else if (condition instanceof EqualCondition) this.transverseEqualCondition(condition);
        else if (condition instanceof LikeCondition) this.transverseLikeCondition(condition);
        else if (condition instanceof IsCondition) this.transverseIsCondition(condition);
    }

    private transverseAndCondition(condition: AndCondition) {
        for (const con of condition.conditions) {
            this.transverseCondition(con);
        }
    }

    private transverseOrCondition(condition: OrCondition) {
        for (const con of condition.conditions) {
            this.transverseCondition(con);
        }
    }

    private transverseEqualCondition(condition: EqualCondition) {
        if (isSimpleSelector(condition.selector) || isAttrSelector(condition.selector)) {
            assertTrue(isString(condition.value));
            return;
        }
        if (isPseudoClassSelector(condition.selector) || isPseudoElementSelector(condition.selector)) {
            assertTrue(isBool(condition.value));
            return;
        }
        throw new Error(`Cannot recognize selector ${condition.selector}`);
    }

    private transverseLikeCondition(condition: LikeCondition) {
        assertTrue(isAttrSelector(condition.selector));
        assertTrue(condition.value.startsWith("%") || condition.value.endsWith("%"));
    }

    private transverseIsCondition(condition: IsCondition) {
        if (isAttrSelector(condition.selector)) {
            assertTrue(condition.value === null);
            return;
        }
        if (isPseudoClassSelector(condition.selector) || isPseudoElementSelector(condition.selector)) {
            assertTrue(isBool(condition.value));
        }
        throw new Error(`Cannot recognize selector ${condition.selector}`);
    }
}

type SQSSVisitorClass = { new (...args: any[]): SQSSVisitor<null, null> };

type SAAgg<N> = Agg<N, SqssNode, void>;
class SemanticAnalyzer {
    preVisitUpdateStatement(node: UpdateStatement, context: null): null {
        return null;
    }
    postVisitUpdateStatement(node: UpdateStatement, context: null, data: SAAgg<UpdateStatement>) {
        return true;
    }

    preVisitAndCondition(node: AndCondition, context: null): null {
        return null;
    }
    postVisitAndCondition(node: AndCondition, context: null, data: SAAgg<AndCondition>) {
        return false;
    }
}

const v: SQSSVisitor<void, null> = new SemanticAnalyzer();
