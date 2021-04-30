import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component, createRef } from "react";
import { isEqual, throttle } from 'lodash';
import { select as d3Select } from 'd3';

export default class D3Base extends Component {
	constructor( props ) {
		super( props );

		this.chartRef = createRef();
	}

	componentDidMount() {
		this.drawUpdatedChart();
	}

	shouldComponentUpdate( nextProps ) {
		return (
			this.props.className !== nextProps.className ||
			! isEqual( this.props.data, nextProps.data ) ||
			this.props.drawChart !== nextProps.drawChart ||
			this.props.height !== nextProps.height ||
			this.props.chartType !== nextProps.chartType ||
			this.props.width !== nextProps.width
		);
	}

	componentDidUpdate() {
		this.drawUpdatedChart();
	}

	componentWillUnmount() {
		this.deleteChart();
	}

	deleteChart() {
		d3Select( this.chartRef.current )
			.selectAll( 'svg' )
			.remove();
	}

	/**
	 * Renders the chart, or triggers a rendering by updating the list of params.
	 */
	drawUpdatedChart() {
		const { drawChart } = this.props;
		const svg = this.getContainer();
		drawChart( svg );
	}

	getContainer() {
		const { className, height, width } = this.props;

		this.deleteChart();

		const svg = d3Select( this.chartRef.current )
			.append( 'svg' )
			.attr( 'viewBox', `0 0 ${ width } ${ height }` )
			.attr( 'height', height )
			.attr( 'width', width )
			.attr( 'preserveAspectRatio', 'xMidYMid meet' );

		if ( className ) {
			svg.attr( 'class', `${ className }__viewbox` );
		}

		return svg.append( 'g' );
	}

	render() {
		const { className } = this.props;
		return (
			<div className={ classNames( 'd3-base', className ) } ref={ this.chartRef } />
		);
	}
}

D3Base.propTypes = {
	className: PropTypes.string,
	data: PropTypes.array,
};
