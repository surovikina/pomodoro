import Highcharts from 'highcharts';

const dailyTemplate = {
    chart: {
        type: "column",
        backgroundColor: "#2a3f50"
    },

    title: {
        text: ""
    },

    xAxis: {
        categories: ["Urgent", "High", "Middle", "Low", "Failed"],
        tickWidth: 0,
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        }
    },

    exporting: {
        enabled: false
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: ""
        },
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        },
        gridLineColor: "#345168",
        gridLineWidth: 1,
        lineWidth: 1,
        lineColor: "#fff"
    },

    tooltip: {
        formatter: function () {
            return (
                "<b>" +
                this.series.name.toUpperCase() +
                "</b><br/>" +
                "Tasks" +
                ": " +
                this.y
            );
        },
        backgroundColor: "#cedeea",
        borderRadius: 3,
        borderWidth: 0,
        followPointer: true,
        style: {
            "font-size": "13px",
            color: "rgb(60, 81, 98)",
            "font-family": "Roboto"
        }
    },

    plotOptions: {
        column: {
            stacking: "normal"
        }
    },

    legend: {
        itemDistance: 15,
        symbolRadius: 0,
        symbolHeight: 8,
        symbolWidth: 8,
        symbolPadding: 6,
        itemMarginTop: 20,
        itemStyle: {
            color: "#8da5b8",
            font: "bold 11px 'Roboto'"
        },
        itemHoverStyle: {
            color: "#8da5b8"
        }
    },

    credits: {
        enabled: false
    },
};

const weeklyTemplate = {
    chart: {
        type: "column",
        backgroundColor: "#2a3f50"
    },

    title: {
        text: ""
    },

    xAxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fr", "Su", "Sa"],
        tickWidth: 0,
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        }
    },

    exporting: {
        enabled: false
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: ""
        },
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        },
        gridLineColor: "#345168",
        gridLineWidth: 1,
        lineWidth: 1,
        lineColor: "#fff"
    },

    tooltip: {
        formatter: function () {
            return (
                "<b>" +
                this.series.name.toUpperCase() +
                "</b><br/>" +
                "Tasks" +
                ": " +
                this.y
            );
        },
        backgroundColor: "#cedeea",
        borderRadius: 3,
        borderWidth: 0,
        followPointer: true,
        style: {
            "font-size": "13px",
            color: "rgb(60, 81, 98)",
            "font-family": "Roboto"
        }
    },

    plotOptions: {
        column: {
            stacking: "normal"
        }
    },

    legend: {
        itemDistance: 15,
        symbolRadius: 0,
        symbolHeight: 8,
        symbolWidth: 8,
        symbolPadding: 6,
        itemMarginTop: 20,
        itemStyle: {
            color: "#8da5b8",
            font: "bold 11px 'Roboto'"
        },
        itemHoverStyle: {
            color: "#8da5b8"
        }
    },

    credits: {
        enabled: false
    },
};

const monthlyTemplate = {
    chart: {
        type: "column",
        backgroundColor: "#2a3f50"
    },

    title: {
        text: ""
    },

    xAxis: {
        tickWidth: 0,
        min: 0,
        tickInterval: 1,
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        }
    },

    exporting: {
        enabled: false
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        endOnTick: true,
        max: null,
        title: {
            text: ""
        },
        labels: {
            style: {
                color: "#fff",
                "font-size": "11px",
                "font-family": "PTSans",
                "font-weight": "bold",
                "text-transform": "uppercase"
            }
        },
        gridLineColor: "#345168",
        gridLineWidth: 1,
        lineWidth: 1,
        lineColor: "#fff"
    },

    tooltip: {
        formatter: function () {
            return (
                "<b>" +
                this.series.name.toUpperCase() +
                "</b><br/>" +
                "Tasks" +
                ": " +
                this.y
            );
        },
        backgroundColor: "#cedeea",
        borderRadius: 3,
        borderWidth: 0,
        followPointer: true,
        style: {
            "font-size": "13px",
            color: "rgb(60, 81, 98)",
            "font-family": "Roboto"
        }
    },

    plotOptions: {
        column: {
            stacking: "normal"
        }
    },

    legend: {
        itemDistance: 15,
        symbolRadius: 0,
        symbolHeight: 8,
        symbolWidth: 8,
        symbolPadding: 6,
        itemMarginTop: 20,
        itemStyle: {
            color: "#8da5b8",
            font: "bold 11px 'Roboto'"
        },
        itemHoverStyle: {
            color: "#8da5b8"
        }
    },

    credits: {
        enabled: false
    },
};

const templates = {
    day: dailyTemplate,
    week: weeklyTemplate,
    month: monthlyTemplate,
};

const tooltipFormatters = {
    pomodoros: function () {
        return (
            `<b>${this.series.name.toUpperCase()}</b><br/>
        <b>Pomodoros: ${this.y}</b>`);
    },
    tasks: function () {
        return (
            `<b>${this.series.name.toUpperCase()}</b><br/>
        <b>Tasks: ${this.y}</b>`);
    }
};

export function createHighchart(root, data) {
    const template = templates[data.interval];
    template.tooltip.formatter = tooltipFormatters[data.type];
    template.series = [
        {
            name: "Urgent",
            data: data.statistics.urgent,
            color: "#f15a4a",
            borderWidth: 0
        },
        {
            name: "High",
            data: data.statistics.high,
            color: "#fea741",
            borderWidth: 0
        },
        {
            name: "Middle",
            data: data.statistics.middle,
            color: "#fddc43",
            borderWidth: 0
        },
        {
            name: "Low",
            data: data.statistics.low,
            color: "#1abb9b",
            borderWidth: 0
        },
        {
            name: "Failed",
            data: data.statistics.failed,
            color: "#8da5b8",
            borderWidth: 0
        }
    ];

    Highcharts.chart(root, template);
}