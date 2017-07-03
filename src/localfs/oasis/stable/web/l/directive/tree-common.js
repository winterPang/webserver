define({
    getTreeNodes: function (tree, type) {
        var checked = tree.getCheckedNodes();
        var selected = [];
        type = type || 'all';
        $.each(checked, function () {
            var node = this;
            if (type == 'all') {
                selected.push(node);
            } else if (type == 'parent') {
                if (node.isParent) {
                    selected.push(node);
                }
            } else if (type == 'child') {
                if (!node.isParent) {
                    selected.push(node);
                }
            }
        });
        return selected;
    }
});