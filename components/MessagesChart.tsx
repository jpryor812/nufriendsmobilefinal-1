import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';
import Card from './Card';
import { messageData } from './MessageData';

enum Period {
  week = "week",
}

export default function MessagesChart() {
    const [chartData, setChartData] = React.useState<barDataItem[]>([]);
    const [weeklyAverage, setWeeklyAverage] = React.useState<number>(0);
    const [chartPeriod, setChartPeriod] = React.useState<Period>(Period.week);
    const [currentWeek, setCurrentWeek] = React.useState<number>(1);

    const MESSAGE_THRESHOLD = 100;
    const LOW_COLOR = '#C6E6FF';
    const HIGH_COLOR = '#BDFFC6';
    const AVERAGE_COLOR = '#FF6B6B';

    const getWeekDateRange = (weekNumber: number) => {
        const weekData = messageData.filter(msg => msg.weekNumber === weekNumber);
        if (weekData.length > 0) {
            const startDate = new Date(weekData[0].date);
            const endDate = new Date(weekData[weekData.length - 1].date);
            
            const formatOptions: Intl.DateTimeFormatOptions = { 
                month: 'short', 
                day: 'numeric'
            };
            
            const start = startDate.toLocaleDateString('en-US', formatOptions);
            const end = endDate.toLocaleDateString('en-US', formatOptions);
            const year = startDate.getFullYear();
            
            return `${start} - ${end}, ${year}`;
        }
        return '';
    };

    const formatDataForWeek = (weekNumber: number) => {
        const weekData = messageData.filter(msg => msg.weekNumber === weekNumber);
        
        const average = Math.round(
            weekData.reduce((sum, msg) => sum + msg.count, 0) / weekData.length
        );
        setWeeklyAverage(average);

        return weekData.map(msg => ({
            value: msg.count,
            label: msg.dayOfWeek.slice(0, 3),
            frontColor: msg.count >= MESSAGE_THRESHOLD ? HIGH_COLOR : LOW_COLOR,
            gradientColor: msg.count >= MESSAGE_THRESHOLD
                ? '#2ECC71'
                : '#42ade2',
            topLabelComponent: () => (
              <Text style={styles.topLabel}>{Math.floor(msg.count)}</Text>
            )
        }));
    };

    React.useEffect(() => {
        setChartData(formatDataForWeek(currentWeek));
    }, [currentWeek]);

    const handlePreviousWeek = () => {
        if (currentWeek > 1) {
            setCurrentWeek(prev => prev - 1);
        }
    };

    const handleNextWeek = () => {
        if (currentWeek < 7) {
            setCurrentWeek(prev => prev + 1);
        }
    };

    // Calculate the Y position for the average line
    const getAverageLinePosition = () => {
        const chartHeight = 150; // This should match your chart height
        const maxValue = 150;    // This should match your chart maxValue
        return chartHeight - (weeklyAverage / maxValue * chartHeight);
    };

    return (
        <Card style={styles.container}>
            <Text style={styles.title}>Messages Sent</Text>
            <View style={styles.header}>
                <Text style={styles.weekText}>{getWeekDateRange(currentWeek)}</Text>
                <View style={styles.navigation}>
                    <Text 
                        style={[styles.navButton, currentWeek === 1 && styles.disabled]}
                        onPress={handlePreviousWeek}
                    >
                        ← Previous
                    </Text>
                    <Text 
                        style={[styles.navButton, currentWeek === 5 && styles.disabled]}
                        onPress={handleNextWeek}
                    >
                        Next →
                    </Text>
                </View>
            </View>
            
            <View style={styles.chartContainer}>
                <View style={styles.chartWrapper}>
                    <BarChart 
                        data={chartData}
                        barBorderRadius={5}
                        noOfSections={3}
                        yAxisThickness={0}
                        xAxisThickness={0}
                        yAxisTextStyle={{color: "gray"}}
                        isAnimated
                        animationDuration={300}
                        maxValue={150}
                        width={300}
                        height={150}
                        barWidth={20}
                        spacing={15}
                        hideRules
                        xAxisLabelTextStyle={styles.xAxisLabel}
                        showFractionalValues={false}
                        showGradient
                    />
                    {/* Average Line Overlay */}
                    <View style={[styles.averageLine, { top: getAverageLinePosition() }]}>
                        <Text style={styles.averageLabel}>{`Avg: ${Math.floor(weeklyAverage)}`}</Text>
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        padding: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    weekText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#808080',
    },
    title: {
        fontSize: 1,
        fontWeight: 'bold',
        color: '#808080',
    },
    navigation: {
        flexDirection: 'row',
        gap: 15,
    },
    navButton: {
        color: '#4A90E2',
        fontSize: 14,
    },
    disabled: {
        opacity: 0.5,
    },
    topLabel: {
        color: 'gray',
        fontSize: 12,
        marginBottom: 1,
    },
    xAxisLabel: {
        color: 'gray',
        fontSize: 12,
    },
    chartContainer: {
        alignItems: 'center',
    },
    chartWrapper: {
        position: 'relative',
    },
    averageLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#fff',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#42ade2',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    averageLabel: {
        color: '#42ade2',
        fontSize: 10,
        marginLeft: 2,
        marginTop: -15,
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        gap: 20,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    legendLine: {
        width: 12,
        height: 2,
        backgroundColor: '#FF6B6B',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#FF6B6B',
    },
    legendText: {
        fontSize: 12,
        color: 'gray',
    },
});