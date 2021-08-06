import React from "react";
import DepartmentPanel from "../DepartmentPanel";

class DepartmentTree extends React.Component {
    render() {
        const departmentPanels = this.props.game.departments.map(dept => 
            <div>
                <DepartmentPanel dept={dept} recalc={this.props.recalc} />
            </div>
        );

        return (
            <div id="dept-tree">
                {departmentPanels}
            </div>
        );
    }
}

export default DepartmentTree;