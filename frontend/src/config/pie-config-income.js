export default {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: '$',
            data: [],
            backgroundColor: [
                '#AAF2CB',
                '#FCF7B1',
                '#E6C0AC',
                '#EDB1FC',
                '#B3D9F5',
                '#FF667F',
                '#644FE3',
                '#64FAE3',
                '#BEE677',
                '#FAAF35',
                '#BCE34F',
                '#FFAB45',
                '#FA0A00',
                '#8F77E6'
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: null,
                font: {
                    size: 28,
                }
            }
        }
    }
}
