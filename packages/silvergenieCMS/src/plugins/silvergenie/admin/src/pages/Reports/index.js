/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import axios from "../../utils/axiosInstance";
import {
  HeaderLayout,
  ContentLayout,
  Layout,
  Select,
  Option,
  Box,
  Flex,
  NumberInput,
  Checkbox,
  Alert,
} from "@strapi/design-system";
import { BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { AllSeriesType } from "@mui/x-charts/models";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { BarChart } from "@mui/x-charts/BarChart";

import { Grid, Typography, CircularProgress } from "@mui/material";

const HomePage = (props) => {
  console.log("🚀 ~ file: index.js:14 ~ HomePage ~ props:", props);
  const [report, setReport] = useState(null);
  const [paymentSeries, setPaymentSeries] = useState(null);

  const getUserData = async () => {
    // const phrReportData = await axios.get("/api/utils/reports/phr", {});
    try {
      const userReportData = await axios.get("/api/utils/reports/user", {});
      const serviceReportData = await axios.get(
        "/api/utils/reports/service",
        {}
      );
      const paymentReportData = await axios.get(
        "/api/utils/reports/payment",
        {}
      );
      setReport({
        ...userReportData.data,
        ...serviceReportData.data,
        ...paymentReportData.data,
      });
    } catch (error) {}
  };
  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    // console.log(report)
    // console.log("🚀 ~ file: index.js:46 ~ useEffect ~ report:", report);
    if (report?.paymentByMonths) {
      const wallet = [];
      const service = [];
      const xAxis = [];
      // const yAxis=[]
      for (const payment of report?.paymentByMonths) {
        wallet.push(payment.value.wallet);
        service.push(payment.value.service);
        xAxis.push(payment.label);
      }
      setPaymentSeries({
        series: [
          {
            type: "bar",
            stack: "",
            yAxisKey: "eco",
            data: wallet,
          },
          {
            type: "bar",
            stack: "",
            yAxisKey: "eco",
            data: service,
          },
        ],
        xAxis,
      });
    }
  }, [report]);
  return (
    <Layout>
      <HeaderLayout
        title="Dashboard"
        subtitle="Reports of various Silvergenie Operations"
        as="h2"
      />
      <ContentLayout>
        {report ? (
          <>
            <Box
              shadow="filterShadow"
              padding={6}
              borderRadius="4px"
              marginBottom="24px"
              background="neutral0"
            >
              <Typography
                color="primary"
                variant="subtitle1"
                fontSize={24}
                fontWeight={700}
              >
                Total Users: {report?.totalUserCount}
              </Typography>
              <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">
                    No of Users in last 3 Months
                  </Typography>
                  <Typography variant="caption">
                    No of users created in last 3 months
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: report.usersByMonths?.map((u) => u.label),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: report.usersByMonths?.map((u) => u.value),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">Users by Service</Typography>
                  <Typography variant="caption">
                    Users divided by Care/ Manpower/ Wellness etc
                  </Typography>

                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: report.userByServices?.map((u) => u.label),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: report.userByServices?.map((u) => u.value),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">Type of Users</Typography>
                  <Typography variant="caption">
                    Users divided by Classic/ Premium/ SuperPremium
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: report.userByType?.map((u) => u.label),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: report.userByType?.map((u) => u.value),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">
                    Payments in Last 3 Months
                  </Typography>
                  <Typography variant="caption">
                    Month vs Amount Transact in Last 3 Months
                  </Typography>
                  <ChartContainer
                    series={paymentSeries?.series || []}
                    width={500}
                    height={400}
                    xAxis={[
                      {
                        id: "months",
                        data: paymentSeries?.xAxis || [],
                        scaleType: "band",
                        valueFormatter: (value) => value.toString(),
                      },
                    ]}
                    yAxis={[
                      {
                        id: "eco",
                        scaleType: "linear",
                        valueFormatter: (value) => value / 1000 + "k",
                      },
                    ]}
                  >
                    <BarPlot />
                    {/* <LinePlot /> */}
                    <ChartsXAxis
                      label="months"
                      position="bottom"
                      axisId="months"
                    />
                    <ChartsYAxis label="" position="left" axisId="eco" />
                    {/* <ChartsYAxis label="PIB" position="right" axisId="pib" /> */}
                  </ChartContainer>
                </Grid>
              </Grid>
            </Box>

            <Box
              shadow="filterShadow"
              padding={6}
              borderRadius="4px"
              marginBottom="24px"
              background="neutral0"
            >
              <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">
                    No of Phrs in last 3 Months
                  </Typography>
                  <Typography variant="caption">
                    Number of PHRs created in last 3 months
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: report.phrByMonths?.map((u) => u.label),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: report.phrByMonths?.map((u) => u.value),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Grid>
                <Grid item sm={12} md={6}>
                  <Typography variant="subtitle1">Number of EPRs</Typography>
                  <Typography variant="caption">
                    Users divided by Classic/ Premium/ SuperPremium
                  </Typography>
                  <BarChart
                    xAxis={[
                      {
                        id: "barCategories",
                        data: report.phrByMonths?.map((u) => u.label),
                        scaleType: "band",
                      },
                    ]}
                    series={[
                      {
                        data: report.phrByMonths?.map((u) => u.value),
                      },
                    ]}
                    width={500}
                    height={300}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <CircularProgress />
        )}
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
