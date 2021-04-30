
import React, { Component, createRef } from "react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as d3array from "d3-array";
import * as d3 from "d3";
import D3Base from './d3base/index.jsx';

/**
 * A simple D3 line and bar chart component for timeseries data in React.
 */
class D3Chart extends Component {
    constructor(props) {
        super(props);
        this.drawChart = this.drawChart.bind(this);
        this.drawChartSeries = this.drawChartSeries.bind(this);

    }

    drawChartSeries(node) {
        const { data, height, width, margin } = this.props;

        const keys = Array.from(d3array.group(data, d => d.key).keys());
        const values = Array.from(d3array.rollup(data, ([d]) => d.value, d => +d.date, d => d.key));
        const series = d3.stack()
            .keys(keys)
            .value(([, values], key) => values.get(key))
            (values);

        const g = node
            .attr('id', 'chart')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
            .range([height - margin.bottom, margin.top]);

        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(d3.schemeCategory10);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const area = d3.area()
            .x(d => x(d.data[0]))
            .y0(d => y(d[0]))
            .y1(d => y(d[1] + d[0]));

        const svg = g.append("svg:svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .selectAll("path")
            .data(series)
            .join("path")
            .attr("fill", ({ key }) => color(key))
            .attr("d", area)
            .append("title")
            .text(({ key }) => key);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
    };

    drawChart(node) {
        const { data, height, width, margin } = this.props;

        const g = node
            .attr('id', 'chart')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleUtc()
            .domain(d3.extent(data, d => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")))
            .call(g => g.select(".domain").remove())
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y));

        const line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => x(d.date))
            .y(d => y(d.value));

        const curve = d3.curveLinear;

        const area = d3.area()
            .curve(curve)
            .x(d => x(d.date))
            .y0(y(0))
            .y1(d => y(d.value));

        const svg = g.append("svg:svg")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("path")
            .datum(data)
            .attr("fill", "steelblue")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", area);
    };


    render() {
        const { className, data, height, width } = this.props;
        return (
            <div
                className={classNames('d3-chart__container', className)}
                style={{ height }}
            >
                <D3Base
                    className={classNames(className)}
                    data={data}
                    drawChart={this.drawChart}
                    height={height}
                    width={width}
                />
            </div>
        );
    }
}

D3Chart.propTypes = {
    className: PropTypes.string,
    data: PropTypes.array.isRequired,
    height: PropTypes.number,
    margin: PropTypes.shape({
        bottom: PropTypes.number,
        left: PropTypes.number,
        right: PropTypes.number,
        top: PropTypes.number,
    }),
    width: PropTypes.number,
};

D3Chart.defaultProps = {
    data: [],
    height: 500,
    margin: { top: 20, right: 30, bottom: 60, left: 80 },
    width: 900,
};

export default D3Chart;
