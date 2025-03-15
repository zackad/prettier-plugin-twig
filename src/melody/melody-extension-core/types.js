/**
 * Copyright 2017 trivago N.V.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
    Node,
    Identifier,
    SequenceExpression,
    type,
    alias,
    visitor,
    StringLiteral
} from "../melody-types/index.js";

export class AutoescapeBlock extends Node {
    /**
     *
     * @param {String | boolean} type
     * @param {Array<Node>} [expressions]
     */
    constructor(type, expressions = []) {
        super();
        this.escapeType = type;
        this.expressions = expressions;
    }
}
type(AutoescapeBlock, "AutoescapeBlock");
alias(AutoescapeBlock, "Block", "Escape");
visitor(AutoescapeBlock, "expressions");

export class BlockStatement extends Node {
    /**
     * @param {Identifier} name
     * @param {Node} body
     */
    constructor(name, body) {
        super();
        this.name = name;
        this.body = body;
    }
}
type(BlockStatement, "BlockStatement");
alias(BlockStatement, "Statement", "Scope", "RootScope");
visitor(BlockStatement, "body");

export class BlockCallExpression extends Node {
    /**
     * @param {StringLiteral} callee
     * @param {Array<Node>} args
     */
    constructor(callee, args = []) {
        super();
        this.callee = callee;
        this.arguments = args;
    }
}
type(BlockCallExpression, "BlockCallExpression");
alias(BlockCallExpression, "Expression", "FunctionInvocation");
visitor(BlockCallExpression, "arguments");

export class MountStatement extends Node {
    /**
     * Constructs an instance with the given parameters.
     *
     * @param {Identifier} [name]
     * @param {string} [source]
     * @param {Node} [key]
     * @param {Node} [argument]
     * @param {boolean} [async]
     * @param {number} [delayBy]
     */
    constructor(name, source, key, argument, async, delayBy) {
        super();
        this.name = name;
        this.source = source;
        this.key = key;
        this.argument = argument;
        this.async = async;
        this.delayBy = delayBy;
        this.errorVariableName = null;
        this.body = null;
        this.otherwise = null;
    }
}
type(MountStatement, "MountStatement");
alias(MountStatement, "Statement", "Scope");
visitor(
    MountStatement,
    "name",
    "source",
    "key",
    "argument",
    "body",
    "otherwise"
);

export class DoStatement extends Node {
    /**
     * @param {Node} expression
     */
    constructor(expression) {
        super();
        this.value = expression;
    }
}
type(DoStatement, "DoStatement");
alias(DoStatement, "Statement");
visitor(DoStatement, "value");

export class EmbedStatement extends Node {
    /**
     * @param {Node} parent
     */
    constructor(parent) {
        super();
        this.parent = parent;
        this.argument = null;
        this.contextFree = false;
        // when `true`, missing templates will be ignored
        this.ignoreMissing = false;
        this.blocks = null;
    }
}
type(EmbedStatement, "EmbedStatement");
alias(EmbedStatement, "Statement", "Include");
visitor(EmbedStatement, "argument", "blocks");

export class ExtendsStatement extends Node {
    /**
     * @param {Node} parentName
     */
    constructor(parentName) {
        super();
        this.parentName = parentName;
    }
}
type(ExtendsStatement, "ExtendsStatement");
alias(ExtendsStatement, "Statement", "Include");
visitor(ExtendsStatement, "parentName");

export class FilterBlockStatement extends Node {
    /**
     * @param {Node} filterExpression
     * @param {Node} body
     */
    constructor(filterExpression, body) {
        super();
        this.filterExpression = filterExpression;
        this.body = body;
    }
}
type(FilterBlockStatement, "FilterBlockStatement");
alias(FilterBlockStatement, "Statement", "Block");
visitor(FilterBlockStatement, "filterExpression", "body");

export class FlushStatement extends Node {
    constructor() {
        super();
    }
}
type(FlushStatement, "FlushStatement");
alias(FlushStatement, "Statement");

export class ForStatement extends Node {
    /**
     * @param {Identifier} keyTarget
     * @param {Identifier} valueTarget
     * @param {Node} sequence
     * @param {Node} condition
     * @param {Node} body
     * @param {Node} otherwise
     */
    constructor(
        keyTarget = null,
        valueTarget = null,
        sequence = null,
        condition = null,
        body = null,
        otherwise = null
    ) {
        super();
        this.keyTarget = keyTarget;
        this.valueTarget = valueTarget;
        this.sequence = sequence;
        this.condition = condition;
        this.body = body;
        this.otherwise = otherwise;
    }
}
type(ForStatement, "ForStatement");
alias(ForStatement, "Statement", "Scope", "Loop");
visitor(
    ForStatement,
    "keyTarget",
    "valueTarget",
    "sequence",
    "condition",
    "body",
    "otherwise"
);

export class ImportDeclaration extends Node {
    /**
     * @param {Node} key
     * @param {Identifier} alias
     */
    constructor(key, alias) {
        super();
        this.key = key;
        this.alias = alias;
    }
}
type(ImportDeclaration, "ImportDeclaration");
alias(ImportDeclaration, "VariableDeclaration");
visitor(ImportDeclaration, "key", "value");

export class FromStatement extends Node {
    /**
     * @param {Node} source
     * @param {Array<ImportDeclaration>} imports
     */
    constructor(source, imports) {
        super();
        this.source = source;
        this.imports = imports;
    }
}
type(FromStatement, "FromStatement");
alias(FromStatement, "Statement");
visitor(FromStatement, "source", "imports");

export class IfStatement extends Node {
    /**
     * @param {Node} test
     * @param {Node} [consequent]
     * @param {Node} [alternate]
     */
    constructor(test, consequent = null, alternate = null) {
        super();
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
}
type(IfStatement, "IfStatement");
alias(IfStatement, "Statement", "Conditional");
visitor(IfStatement, "test", "consequent", "alternate");

export class IncludeStatement extends Node {
    /**
     * @param {Node} source
     */
    constructor(source) {
        super();
        this.source = source;
        this.argument = null;
        this.contextFree = false;
        // when `true`, missing templates will be ignored
        this.ignoreMissing = false;
    }
}
type(IncludeStatement, "IncludeStatement");
alias(IncludeStatement, "Statement", "Include");
visitor(IncludeStatement, "source", "argument");

export class MacroDeclarationStatement extends Node {
    /**
     * @param {Identifier} name
     * @param {Array<Node>} args
     * @param {SequenceExpression} body
     */
    constructor(name, args, body) {
        super();
        this.name = name;
        this.arguments = args;
        this.body = body;
    }
}
type(MacroDeclarationStatement, "MacroDeclarationStatement");
alias(MacroDeclarationStatement, "Statement", "Scope", "RootScope");
visitor(MacroDeclarationStatement, "name", "arguments", "body");

export class VariableDeclarationStatement extends Node {
    /**
     * @param {Identifier} name
     * @param {Node} value
     */
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
}
type(VariableDeclarationStatement, "VariableDeclarationStatement");
alias(VariableDeclarationStatement, "Statement");
visitor(VariableDeclarationStatement, "name", "value");

export class SetStatement extends Node {
    /**
     * @param {Array<VariableDeclarationStatement>} assignments
     */
    constructor(assignments) {
        super();
        this.assignments = assignments;
    }
}
type(SetStatement, "SetStatement");
alias(SetStatement, "Statement", "ContextMutation");
visitor(SetStatement, "assignments");

export class PropsStatement extends Node {
    /**
     *
     * @param {Array<PropItem>} items
     */
    constructor(items) {
        super();
        this.items = items;
    }
}
type(PropsStatement, "PropsStatement");
alias(PropsStatement, "Statement");
visitor(PropsStatement, "items");

export class PropItem extends Node {
    /**
     *
     * @param {Identifier} name
     * @param {Node|undefined} value
     */
    constructor(name, value = undefined) {
        super();
        this.name = name;
        this.value = value;
    }
}
type(PropItem, "PropItem");
alias(PropItem, "Expression");
visitor(PropItem, "value");

export class SpacelessBlock extends Node {
    /**
     * @param {Node} [body]
     */
    constructor(body = null) {
        super();
        this.body = body;
    }
}
type(SpacelessBlock, "SpacelessBlock");
alias(SpacelessBlock, "Statement", "Block");
visitor(SpacelessBlock, "body");

export class AliasExpression extends Node {
    /**
     * @param {Identifier} name
     * @param {Identifier} alias
     */
    constructor(name, alias) {
        super();
        this.name = name;
        this.alias = alias;
    }
}
type(AliasExpression, "AliasExpression");
alias(AliasExpression, "Expression");
visitor(AliasExpression, "name", "alias");

export class UseStatement extends Node {
    /**
     * @param {Node} source
     * @param {Array<AliasExpression>} aliases
     */
    constructor(source, aliases) {
        super();
        this.source = source;
        this.aliases = aliases;
    }
}
type(UseStatement, "UseStatement");
alias(UseStatement, "Statement", "Include");
visitor(UseStatement, "source", "aliases");

export {
    UnaryNotExpression,
    UnaryNeqExpression,
    UnaryPosExpression,
    BinaryOrExpression,
    BinaryAndExpression,
    BitwiseOrExpression,
    BitwiseXorExpression,
    BitwiseAndExpression,
    BinaryEqualsExpression,
    BinaryNotEqualsExpression,
    BinaryLessThanExpression,
    BinaryGreaterThanExpression,
    BinaryLessThanOrEqualExpression,
    BinaryGreaterThanOrEqualExpression,
    BinaryNotInExpression,
    BinaryInExpression,
    BinaryMatchesExpression,
    BinaryStartsWithExpression,
    BinaryEndsWithExpression,
    BinaryRangeExpression,
    BinaryAddExpression,
    BinaryMulExpression,
    BinaryDivExpression,
    BinaryFloorDivExpression,
    BinaryModExpression,
    BinaryPowerExpression,
    BinaryNullCoalesceExpression,
    TestEvenExpression,
    TestOddExpression,
    TestDefinedExpression,
    TestSameAsExpression,
    TestNullExpression,
    TestDivisibleByExpression,
    TestConstantExpression,
    TestEmptyExpression,
    TestIterableExpression
} from "./operators.js";
