import {
    SqssStyleSheet,
    UpdateStatement,
    StyleAssignment,
    Condition,
    AndCondition,
    OrCondition,
    AtomicCondition,
} from "./ast";
import {
    assertEqual,
    isKebabCase,
    isString,
    isBool,
    isSimpleSelector,
    isPseudoElementSelector,
    isPseudoClassSelector,
    isAttrSelector,
} from "../utils";

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
        else if (condition instanceof AtomicCondition) this.transverseAtomicCondition(condition);
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

    private transverseAtomicCondition(condition: AtomicCondition) {
        if (isSimpleSelector(condition.selector)) {
            assertEqual(condition.operator, "=");
            assertEqual(condition.value !== null, true);
            return;
        }
        if (isAttrSelector(condition.selector)) {
            if (condition.operator === "IS") {
                assertEqual(condition.value === null, true);
            }
            if (condition.operator === "LIKE") {
                // @ts-ignore
                assertEqual(isString(condition.value), true);
                const value = condition.value as string;
                assertEqual(Boolean(value.match(/^%?[^%]+%?$/)), true);
            }
            if (condition.operator === "=") {
                assertEqual(isString(condition.value), true);
            }
            return;
        }
        if (isPseudoClassSelector(condition.selector) || isPseudoElementSelector(condition.selector)) {
            // @ts-ignore
            assertEqual(isBool(condition.value), true);
            assertEqual(condition.operator !== "LIKE", true);
            return;
        }
        throw new Error(`Cannot recognize selector ${condition.selector}`);
    }
}
