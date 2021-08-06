import React from 'react';
import './index.css';

class DepartmentPanel extends React.Component {
	render() {
		const deptText = this.props.dept.text;
		return (
			<div class="department-panel dept-level-0">
				<div class="top-info rounded-top">
					<div class="dept-name"><span>{deptText.name}</span></div>
					<div class="dept-level"><span>Level {deptText.level}</span></div>
				</div>
				<div class="bottom-info rounded-bottom">
					<div class="dept-info">
						<p class="dept-info-item"><strong>{deptText.customersPerSecond}</strong> customers per second</p>
						<p class="dept-info-item"><strong>{deptText.revenuePerSecond}</strong> per second</p>
					</div>
					<div class="dept-buttons">
						<div class="dept-button dept-info-button">Ⓘ</div>
						<div class="dept-button dept-level-button" onClick={this.onLevelUpClick}>⇪ Level Up ({deptText.cost})</div>
					</div>
				</div>
			</div>
		);
	}

	onLevelUpClick = () => {
		this.props.dept.tryLevelUp();
		this.props.recalc();
	}
}

export default DepartmentPanel;