import React from "react";

class MainStoreInfo extends React.Component {
    render() {
        const gameText = this.props.game.text;

        return (
            <div id="main-panel">
                <div id="main-store-info">
                    <p id="bank">{gameText.bank}</p>
                    <div id="sat-revenue">
                        <span id="satisfaction">{gameText.satisfaction}</span>
                        <span> | </span>
                        <span id="revenue">Revenue/second: {gameText.revenuePerSecond}</span>
                    </div>
                </div>
                <div class="main-separator"></div>
                <div id="secondary-store-info">
                    <ul id="secondary-info-list">
                        <li id="customers-per-second">Customers/second: {gameText.customersPerSecond}</li>
                        <li id="products-per-second">Products Sold/second: {gameText.productsSoldPerSecond}</li>
                        <li id="dept-count">Departments: {gameText.departmentCount}
                            <ul id="dept-info">
                                <li id="level-count">Levels: {gameText.departmentLevelSum}</li>
                                <li id="store-space">{gameText.usedArea} ft<sup>2</sup> of {gameText.totalArea} ft<sup>2</sup> occupied</li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="main-separator"></div>
                <div id="employee-info">
                    <ul id="employee-info-list">
                        <li id="employee-count">Employees and Managers: {gameText.employeeCount}</li>
                        <li id="manager-slot-count">Manager Slots Assigned: {gameText.managerSlotsAssigned}/{gameText.managerSlotsAvailable}</li>
                        <li id="accidents">There were {gameText.accidentsLast24h} accidents in the last 24 hours.
                            <ul id="accident-list">
                                {/*gameText.accidents.map(function(accident, index){
                                    return <li key={index}>{accident}</li>
                                })*/}
                            </ul>
                        </li>
                    </ul>
                </div>
                <div class="main-separator"></div>
                <div id="gameplay-assistants">
                    <h3>Level Up Every Department:</h3>
                </div>
                <div id="promotion-info"></div>
            </div>
        );
    }
}

export default MainStoreInfo;