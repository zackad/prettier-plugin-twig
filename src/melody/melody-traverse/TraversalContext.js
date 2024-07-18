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
import Path from "./Path.js";

export default class TraversalContext {
    constructor(scope, visitor, state, parentPath) {
        this.parentPath = parentPath;
        this.scope = scope;
        this.state = state;
        this.visitor = visitor;

        this.queue = null;
        this.priorityQueue = null;
    }

    /**
     * @returns {Path}
     */
    create(parent, container, key, listKey) {
        return Path.get({
            parentPath: this.parentPath,
            parent,
            container,
            key,
            listKey
        });
    }

    /**
     * @returns {boolean}
     */
    shouldVisit(node) {
        const visitor = this.visitor;

        if (visitor[node.type]) {
            return true;
        }

        /** @type {Array<String>} */
        const keys = node.visitorKeys;
        // this node doesn't have any children
        if (!keys || !keys.length) {
            return false;
        }

        let i;
        let len;
        for (i = 0, len = keys.length; i < len; i++) {
            // check if some of its visitor keys have a value,
            // if so, we need to visit it
            if (node[keys[i]]) {
                return true;
            }
        }

        return false;
    }

    visit(node, key) {
        const nodes = node[key];
        if (!nodes) {
            return false;
        }

        if (Array.isArray(nodes)) {
            return this.visitMultiple(nodes, node, key);
        }
        return this.visitSingle(node, key);
    }

    /**
     * @returns {boolean}
     */
    visitSingle(node, key) {
        if (this.shouldVisit(node[key])) {
            return this.visitQueue([this.create(node, node, key)]);
        }
        return false;
    }

    visitMultiple(container, parent, listKey) {
        if (!container.length) {
            return false;
        }

        const queue = [];

        for (let i = 0, len = container.length; i < len; i++) {
            const node = container[i];
            if (node && this.shouldVisit(node)) {
                queue.push(this.create(parent, container, i, listKey));
            }
        }

        return this.visitQueue(queue);
    }

    /**
     * @param {Array<Path>} queue
     */
    visitQueue(queue) {
        this.queue = queue;
        this.priorityQueue = [];

        const visited = [];
        let stop = false;

        for (const path of queue) {
            path.resync();
            path.pushContext(this);

            if (visited.indexOf(path.node) >= 0) {
                continue;
            }
            visited.push(path.node);

            if (path.visit()) {
                stop = true;
                break;
            }

            if (this.priorityQueue.length) {
                stop = this.visitQueue(this.priorityQueue);
                this.priorityQueue = [];
                this.queue = queue;
                if (stop) {
                    break;
                }
            }
        }

        for (const path of queue) {
            path.popContext();
        }

        this.queue = null;

        return stop;
    }

    /**
     * @param {boolean} [notPriority]
     */
    maybeQueue(path, notPriority) {
        if (this.queue) {
            if (notPriority) {
                this.queue.push(path);
            } else {
                this.priorityQueue.push(path);
            }
        }
    }
}
