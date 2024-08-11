class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor(head = null) {
    this.head = head;
  }

  size() {
    let count = 0;
    let node = this.head;
    while (node) {
      count++;
      node = node.next;
    }
    return count;
  }

  hasSpace(number) {
    let node = this.head;
    while (node) {
      if (node.data[1] - node.data[0] >= number) return true;
      node = node.next;
    }
    return false;
  }

  findAvailableNodes(number) {
    let nodes = new Array();
    let node = this.head;
    while (node) {
      if (node.data[1] - node.data[0] >= number) nodes.push(node.data);
      node = node.next;
    }
    return nodes;
  }

  clear() {
    this.head = null;
  }

  push(data) {
    let node = this.head;
    if (node == null) this.head = new ListNode(data);
    else {
      while (node.next) {
        node = node.next;
      }
      node.next = new ListNode(data);
    }
  }

  update(heapArray) {
    this.clear();
    let init = findInit(heapArray, 0);
    let final = findFinal(heapArray, init);
    this.push([init, final]);
    while (init != -1 && final != -1) {
      init = findInit(heapArray, final + 1);
      final = findFinal(heapArray, init);
      this.push([init, final]);
    }
  }
}

function findInit(heapArray, init) {
  if (init < heapArray.length) {
    for (let i = init; i < heapArray.length; i++) {
      if (!heapArray[i]) return i;
    }
  }
  return -1;
}

function findFinal(heapArray, init) {
  for (let i = init; i <= heapArray.length; i++) {
    if (i == heapArray.length) return i - 1;
    else if (heapArray[i]) return i - 1;
  }
  return -1;
}
