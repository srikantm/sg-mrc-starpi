import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../../pluginId";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import axios from "../../../utils/axiosInstance";
import { openUrl } from "../../../utils";
import { groupBy, sortBy } from "lodash";
import {
  HeaderLayout,
  ContentLayout,
  Layout,
  Select,
  Option,
  Box as Sbox,
  Flex,
  NumberInput,
  Checkbox,
  Alert,
  Button as SButton,
} from "@strapi/design-system";
import { BarPlot } from "@mui/x-charts/BarChart";
import { LinePlot } from "@mui/x-charts/LineChart";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { AllSeriesType } from "@mui/x-charts/models";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { BarChart } from "@mui/x-charts/BarChart";
import { Icon } from "@iconify/react";
import { Link as RDLink, useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import {
  Grid,
  Typography,
  CircularProgress,
  Link,
  Button,
  Box,
} from "@mui/material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
  // Legend
);

const baseRoute = "/admin/plugins/silvergenie/user-wallets";
const Card = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <Box
      width={"100vw"}
      component={Sbox}
      shadow="filterShadow"
      padding={6}
      borderRadius="4px"
      marginBottom="24px"
      background="neutral0"
      {...props}
      ref={ref}
    >
      {children}
    </Box>
  );
});

const defaultOptions = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "chart",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      // position: "left",
      min: 0,
      // max: 100,
    },
    // y1: {
    //   type: "linear",
    //   display: true,
    //   position: "right",
    //   grid: {
    //     drawOnChartArea: false,
    //   },
    // },
  },
};
// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// export const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//       borderColor: 'rgb(255, 99, 132)',
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       yAxisID: 'y',
//     },
//     // {
//     //   label: 'Dataset 2',
//     //   data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     //   borderColor: 'rgb(53, 162, 235)',
//     //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     //   yAxisID: 'y1',
//     // },
//   ],
// };
const HomePage = (props) => {
  const { phrId } = useParams();
  // const cme = useCMEditViewDataManager();
  // console.log(props, cme);
  const [phr, setPhr] = useState([]);
  const [diagnosedServices, setDiagnosedServices] = useState([]);

  const getData = async () => {
    try {
      axios
        .get(`/api/phrs/${phrId}`, {
          params: {
            populate: [
              // "diagnosedServices.serviceName",
              // "diagnosedServices.serviceProvider",
              "chronicCondition.condition",
            ],
          },
        })
        .then((response) => {
          setPhr(response.data?.data?.attributes);
          let diag = response.data?.data?.attributes.chronicCondition;
          diag = groupBy(diag, (d) => {
            return d.condition.data.attributes.name;
          });
          const finalDiag = [];
          console.log(
            "🚀 ~ file: vitals.js:156 ~ .then ~ finalDiag:",
            finalDiag
          );
          for (let key in diag) {
            if (diag[key].length > 1) {
              const labels = [];
              const data1 = [];
              const data2 = [];
              diag[key]?.forEach((d) => {
                labels.push(d.diagnosedDate);
                const data = d.value.split("/");
                data1.push(data[0]?.match(/\d+\.?\d*/)?.shift() || "0");
                data2.push(data[1]?.match(/\d+\.?\d*/)?.shift() || "0");
              });
              finalDiag.push({
                name: key,
                data: {
                  labels,
                  datasets: [
                    {
                      label: `${key} High`,
                      data: data1,
                      borderColor: "rgb(255, 99, 132)",
                      backgroundColor: "rgba(255, 99, 132, 0.5)",
                      yAxisID: "y",
                    },
                    {
                      label: `${key} Low`,
                      data: data2,
                      borderColor: "rgb(53, 162, 235)",
                      backgroundColor: "rgba(53, 162, 235, 0.5)",
                      yAxisID: "y",

                      // yAxisID: "y1",
                    },
                  ],
                  options: {
                    ...defaultOptions,
                    plugins: {
                      title: {
                        display: true,
                        text: key,
                      },
                    },
                  },
                },
              });
            }
          }

          setDiagnosedServices(finalDiag);
        })
        .catch(console.error);
    } catch (error) {
      console.error("🚀 ~ file: index.js:22 ~ getUserData ~ error:", error);
    }
  };
  const ref = useRef();

  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <HeaderLayout title={`Vital Charts`} subtitle={`Download`} as="h2" />
      <ContentLayout>
        <Grid container spacing={4}>
          {!!diagnosedServices.length && (
            <ReactToPrint
              bodyClass="print-agreement"
              content={() => ref.current}
              trigger={() => (
                <Button variant="contained" fullWidth color="primary">
                  Print
                </Button>
              )}
            />
          )}

          <Card ref={ref}>
            {!!diagnosedServices.length && (
              <Grid container spacing={10}>
                {diagnosedServices.map((ds, i) => (
                  <Grid item md={6} key={i}>
                    {/* <Typography>{ds.name}</Typography> */}
                    <Line options={ds.data.options} data={ds.data} />
                  </Grid>
                ))}
              </Grid>
            )}
            {!diagnosedServices.length && (
              <Typography>
                No Data Available to construct the charts !!
              </Typography>
            )}
          </Card>
        </Grid>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
