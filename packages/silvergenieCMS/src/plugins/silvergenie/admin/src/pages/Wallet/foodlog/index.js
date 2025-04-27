import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../../pluginId";
import { useCMEditViewDataManager } from "@strapi/helper-plugin";
import axios from "../../../utils/axiosInstance";
import { openUrl } from "../../../utils";
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
const baseRoute = "/admin/plugins/silvergenie/user-wallets";
const Card = React.forwardRef(({ children, ...props }, ref) => {
  return (
    <Box
      width={"100wh"}
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
// const Card = ({ children, ...props }) => (
//   <Box
//     component={Sbox}
//     shadow="filterShadow"
//     padding={6}
//     borderRadius="4px"
//     marginBottom="24px"
//     background="neutral0"
//     {...props}
//   >
//     {children}
//   </Box>
// );
const HomePage = (props) => {
  const { paymentId } = useParams();
  // const cme = useCMEditViewDataManager();
  // console.log(props, cme);
  const [payment, setPayment] = useState([]);

  const getData = async () => {
    // const data = "";
    try {
      // const data = await axios(`/api/users/${userId}`, {
      //   method: "GET",
      //   params: {
      //     populate: "*",
      //   },
      // });
      // setUser(data.data);

      axios
        .get(`/api/payment-transactions/${paymentId}`, {
          params: {
            populate: ["user.address"],
            // filters: {
            //   user: data.data.id,
            // },
          },
        })
        .then((response) => setPayment(response.data?.data))
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
      <HeaderLayout
        title={`INVOICE DOWNLOAD`}
        subtitle={`Download 
        `}
        as="h2"
      />
      <ContentLayout>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {/* <Typography>Invoice</Typography> */}
                <Card ref={ref}>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography
                        color="#0ab0e0"
                        fontWeight={600}
                        fontSize={28}
                      >
                        Silvergenie
                      </Typography>
                      <Typography color="#666">yoursilvergenie.com</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={"right"}>
                      <Typography>
                        <Typography component={"span"} fontWeight={600}>
                          Invoice Number
                        </Typography>
                        : &nbsp;#00{paymentId}{" "}
                      </Typography>

                      <Typography>
                        <Typography component={"span"} fontWeight={600}>
                          Created:
                        </Typography>
                        : &nbsp;{payment.attributes?.transactionDate}{" "}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container mt={5}>
                    <Grid item xs={6}>
                      <Typography color="#000" fontWeight={600} fontSize={15}>
                        Silvergenie Pvt Ltd.
                      </Typography>
                      <Typography color="#666">
                        Room 308, 3rd Floor, STPI-Gurugram, 30, <br />
                        Electronic City, Phase-IV, <br />
                        Udyog Vihar, Sector-18,
                        <br /> Gurugram-122015
                      </Typography>
                    </Grid>
                    <Grid item xs={6} textAlign={"right"}>
                      <Typography fontWeight={600}>Invoice To:</Typography>
                      <Box color={"#666"}>
                        <Typography>
                          <Typography component={"span"} fontWeight={600}>
                            {payment.attributes?.user.data.attributes.firstName}
                            &nbsp;
                            {payment.attributes?.user.data.attributes.lastName}
                          </Typography>
                          <br />
                          {payment.attributes?.user.data.attributes.email}
                        </Typography>

                        <Typography>
                          {
                            payment.attributes?.user.data.attributes.address
                              .streetAddress
                          }
                          <br />
                          {
                            payment.attributes?.user.data.attributes.address
                              .state
                          }
                          <br />
                          {
                            payment.attributes?.user.data.attributes.address
                              .city
                          }
                          <br />
                          {
                            payment.attributes?.user.data.attributes.address
                              .postalCode
                          }
                          {
                            payment.attributes?.user.data.attributes.address
                              .country
                          }
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <TableContainer component={Box} mt={5} bgcolor={"#efefef"}>
                      <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead
                          bgcolor={"#777"}
                          sx={{ th: { color: "#fff" } }}
                        >
                          <TableRow>
                            <TableCell>Trx Date</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Paid For</TableCell>
                            <TableCell align="right">Payment Method</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {payment.attributes?.transactionDate}
                            </TableCell>
                            <TableCell align="right">
                              {payment.attributes?.status}
                            </TableCell>

                            <TableCell align="right">
                              {payment.attributes?.paymentFor}
                            </TableCell>
                            <TableCell align="right">
                              {payment.attributes?.paymentMethod}
                            </TableCell>
                            <TableCell align="right">
                              {payment.attributes?.value}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box width={"100%"} align="right" textAlign={"right"}>
                      <Typography fontSize={18} fontWeight={600}>
                        Total - ₹{payment.attributes?.value}
                      </Typography>
                    </Box>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box
              component={Sbox}
              display="flex"
              flexDirection={"column"}
              gap={1}
            >
              <Typography>Actions</Typography>

              <ReactToPrint
                bodyClass="print-agreement"
                content={() => ref.current}
                trigger={() => (
                  <Button variant="contained" fullWidth color="primary">
                    Print
                  </Button>
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
