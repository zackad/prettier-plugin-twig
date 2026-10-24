import { DoStatement, PropItem, PropsStatement } from "../types.js";
import {
    attachListItemComments,
    attachTrailingComments,
    createNode,
    setEndFromToken,
    setStartFromToken,
    Types
} from "../../melody-parser/index.js";
import { Identifier } from "../../melody-types/index.js";

export const PropsParser = {
    name: "props",
    parse(parser, token) {
        const tokenStream = parser.tokens;
        const items = [];
        let name;
        let nameNode;
        let valueNode;

        do {
            name = tokenStream.expect(Types.SYMBOL);
            nameNode = createNode(Identifier, name, name.text);
            if (tokenStream.test(Types.ASSIGNMENT)) {
                tokenStream.expect(Types.ASSIGNMENT);
                valueNode = parser.matchExpression();
            } else {
                valueNode = undefined;
            }
            const item = attachListItemComments(
                new PropItem(nameNode, valueNode),
                items[items.length - 1],
                tokenStream,
                name
            );
            items.push(item);
        } while (tokenStream.nextIf(Types.COMMA));
        attachTrailingComments(
            items[items.length - 1],
            tokenStream,
            tokenStream.la(0)
        );

        const propsStatement = new PropsStatement(items);
        setStartFromToken(propsStatement, token);
        setEndFromToken(propsStatement, tokenStream.expect(Types.TAG_END));
        return propsStatement;
    }
};
