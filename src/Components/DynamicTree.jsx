import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './DynamicTree.css'; 

const DynamicTree = () => {
  const [treeData, setTreeData] = useState([
    {
      id: 1,
      title: 'Root',
      children: [],
      isExpanded: true,
    },
  ]);

//   ----------find node---------------

const findNode = (nodes, id) => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }
      if (node.children.length > 0) {
        const foundNode = findNode(node.children, id);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  };
  
  const findParentNode = (nodes, id) => {
    for (const node of nodes) {
      if (node.children.some((child) => child.id === id)) {
        return node;
      }
      if (node.children.length > 0) {
        const foundParentNode = findParentNode(node.children, id);
        if (foundParentNode) {
          return foundParentNode;
        }
      }
    }
    return null;
  };
  

  const renderTreeNode = (node) => (
    <li key={node.id} className={`list-group-item ${node.isExpanded ? 'expanded' : ''}`}>
      <div className="d-flex align-items-center">
        {node.title}
        <button
          className="btn btn-success ms-auto mx-1"
          onClick={() => handleAddChild(node.id)}
        >
          Add Child
        </button>
        <button
          className="btn  btn-primary mx-1"
          onClick={() => handleEditChild(node.id)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger mx-1"
          onClick={() => handleDeleteChild(node.id)}
        >
          Delete
        </button>
        <button
          className="btn btn-secondary mx-1"
          onClick={() => handleToggleExpand(node.id)}
        >
          {node.isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      {node.children.length > 0 && (
        <ul className={`list-group ${node.isExpanded ? 'd-block' : 'd-none'}`}>
          {node.children.map((childNode) => renderTreeNode(childNode))}
        </ul>
      )}
    </li>
  );

  const handleAddChild = (parentId) => {
    const newNodeTitle = prompt('Enter the new child node name:');
    if (newNodeTitle !== null && newNodeTitle.trim() !== '') {
      const newNode = {
        id: Date.now(),
        title: newNodeTitle,
        children: [],
        isExpanded: true,
      };

      const updatedTree = [...treeData];
      const parentNode = findNode(updatedTree, parentId);
      parentNode.children.push(newNode);

      setTreeData(updatedTree);
    }
  };

  const handleEditChild = (id) => {
    const updatedTree = [...treeData];
    const nodeToEdit = findNode(updatedTree, id);

    const newText = prompt('Enter new text:');
    if (newText !== null && newText.trim() !== '') {
      nodeToEdit.title = newText;
      setTreeData(updatedTree);
    }
  };

  const handleDeleteChild = (id) => {
    const updatedTree = [...treeData];
    const parentNode = findParentNode(updatedTree, id);

    if (parentNode) {
      parentNode.children = parentNode.children.filter((child) => child.id !== id);
      setTreeData(updatedTree);
    }
  };

  const handleToggleExpand = (id) => {
    const updatedTree = [...treeData];
    const nodeToExpand = findNode(updatedTree, id);

    nodeToExpand.isExpanded = !nodeToExpand.isExpanded;
    setTreeData(updatedTree);
  };

  const handleGlobalToggle = () => {
    const shouldExpand = !treeData.every(node => node.isExpanded);
    const updatedTree = shouldExpand ? handleExpandAll([...treeData]) : handleCollapseAll([...treeData]);
    setTreeData(updatedTree);
  };

  const handleExpandAll = (nodes) => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      isExpanded: true,
      children: handleExpandAll(node.children),
    }));
    return updatedNodes;
  };

  const handleCollapseAll = (nodes) => {
    const updatedNodes = nodes.map((node) => ({
      ...node,
      isExpanded: false,
      children: handleCollapseAll(node.children),
    }));
    return updatedNodes;
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <p className="alert alert-danger">
            Use the buttons to add, edit, and delete child nodes. Use the Global Toggle button to expand/collapse all nodes.
          </p>
          <button className="btn btn-info mb-3" onClick={handleGlobalToggle}>
            {treeData.every(node => node.isExpanded) ? 'Global Collapse' : 'Global Expand'}
          </button>
          <ul className="list-group">
            {treeData.map((rootNode) => renderTreeNode(rootNode))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicTree;
