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
import { IconButton } from "@mui/material";

import {
  Grid,
  Typography,
  CircularProgress,
  Link,
  Button,
  Box,
  Tooltip,
} from "@mui/material";
const baseRoute = "/admin/plugins/silvergenie/user-wallets";

const Card = ({ children, ...props }) => (
  <Box
    component={Sbox}
    shadow="filterShadow"
    padding={6}
    borderRadius="4px"
    marginBottom="24px"
    background="neutral0"
  >
    {children}
  </Box>
);
const HomePage = (props) => {
  const { userId } = useParams();
  // const cme = useCMEditViewDataManager();
  // console.log(props, cme);
  const [user, setUser] = useState({});
  const [documents, setDocuments] = useState([]);
  const [userDocuments, setUserDocuments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [phr, setPHR] = useState({});
  const [payments, setPayments] = useState([]);
  const [walletPayments, setWalletPayments] = useState([]);

  const getUserData = async () => {
    // const data = "";
    try {
      const data = await axios(`/api/users/${userId}`, {
        method: "GET",
        params: {
          populate: "*",
        },
      });
      setUser(data.data);
      if (data?.data?.phr?.id) {
        axios
          .get(`/api/phrs/${data.data.phr.id}`, {
            params: {
              populate: [
                "prescription.Medicine",
                "prescription.doctorType",
                "prescription.alternateMedicine",
                "prescription.media",
                "documents",
                "address",
                "chronicCondition.condition",
                "vaccineRecords",
                "diagnosedServices.serviceName",
                "diagnosedServices.serviceProvider",
                "medicalConditions.condition",
                "covidVaccines",
                "allergies",
                "fitnessRegime",
                "belongsTo",
                "createdBy",
                "updatedBy",
              ],
            },
          })
          .then((response) => {
            setPHR({
              ...response.data?.data?.attributes,
              id: response.data?.data?.id,
            });
            const _phr = response.data?.data?.attributes;
            let docs = [];
            if (_phr.documents?.data && _phr.documents?.data.length) {
              // docs = docs.concat(_phr.documents?.data);
              _phr.documents?.data?.forEach((doc) => {
                if (doc.attributes?.document?.data) {
                  doc.attributes?.document?.data?.forEach((d) => {
                    docs.push({
                      ...d.attributes,
                      source: `PHR`,
                    });
                  });
                } else {
                  docs.push({
                    ...doc.attributes,
                    source: `PHR`,
                  });
                }
              });
            }
            _phr?.prescription?.forEach((p) => {
              if (p.media?.data && p.media.data.length) {
                // docs = docs.concat(p.media?.data);
                p.media.data?.forEach((doc) => {
                  if (doc.attributes?.document?.data) {
                    doc.attributes?.document?.data?.forEach((d) => {
                      docs.push({
                        ...d.attributes,
                        source: `prescription - ${p.prescribedBy}`,
                        comments: `Doctor - ${p.prescribedBy}, ${p.doctorType?.data?.attributes?.name}`,
                      });
                    });
                  } else {
                    docs.push({
                      ...doc.attributes,
                      source: `prescription - ${p.prescribedBy}`,
                      comments: `Doctor - ${p.prescribedBy}, ${p.doctorType?.data?.attributes?.name}`,
                    });
                  }
                });
              }
            });
            // const finalDocs = [];
            // docs.forEach((doc) => {

            // });
            setDocuments([...documents, ...docs]);
          })
          .catch(console.error);
      }
      axios
        .get(`/api/user-documents/`, {
          params: {
            populate: "*",
            filters: {
              user: data.data.id,
            },
          },
        })
        .then((docs) =>
          setUserDocuments([...userDocuments, ...docs.data?.data])
        )
        .catch(console.error);

      axios
        .get(`/api/service-bookings/`, {
          params: {
            populate: "*",
            filters: {
              bookedBy: data.data.id,
            },
          },
        })
        .then((sh) => {
          console.log("🚀 ~ file: index.js:184 ~ .then ~ sh:", sh);

          setServiceHistory(sh.data?.data);
        })
        .catch(console.error);

      axios
        .get(`/api/payment-transactions/`, {
          params: {
            populate: "*",
            filters: {
              user: data.data.id,
            },
          },
        })
        .then((response) => setPayments(response.data?.data))
        .catch(console.error);

      axios
        .get(`/api/payment-transactions/`, {
          params: {
            populate: "*",
            filters: {
              user: data.data.id,
              paymentFor: "WALLET",
            },
          },
        })
        .then((response) => setWalletPayments(response.data?.data))
        .catch(console.error);
    } catch (error) {
      console.error("🚀 ~ file: index.js:22 ~ getUserData ~ error:", error);
    }
  };
  const walletBalance = useMemo(() => {
    let b = 0;
    walletPayments.forEach((p) => {
      b = b + p.attributes.value;
    });
    return b;
  }, [walletPayments]);
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <HeaderLayout
        title={`${user.firstName} ${user.lastName}`}
        subtitle={`${user.email} \n ${user.phoneNumber}`}
        as="h2"
      />
      <ContentLayout>
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Clinical Documents</Typography>
                <Card>
                  <TableContainer component={Box}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Actions</TableCell>
                          <TableCell>Comments</TableCell>
                          <TableCell>Source</TableCell>
                          {/* <TableCell align="right">Actions</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.map((row) => (
                          <TableRow
                            key={row.hash}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell>
                              <Tooltip arrow title="download">
                                <IconButton
                                  onClick={() => openUrl(row.url, "__blank")}
                                >
                                  <Icon icon={"ph:download-duotone"} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{row.comments}</TableCell>
                            <TableCell>{row.source}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* {documents.map((d) => {
                    if (d?.attributes?.document?.data) {
                      return d.attributes?.document?.data?.map((k) => (
                        <Typography>
                          {k?.attributes?.name}-&nbsp;&nbsp;{"   "}
                          <Typography component={"span"} fontSize={12}>
                            <Link target="__blank" href={k.attributes?.url}>
                              <Icon icon={"ph:download-duotone"} />
                              Download
                            </Link>
                          </Typography>
                        </Typography>
                      ));
                    } else {
                      return (
                        <Typography>
                          {d?.attributes?.name}-&nbsp;&nbsp;{"   "}
                          <Typography component={"span"} fontSize={12}>
                            <Link target="__blank" href={d?.attributes?.url}>
                              <Icon icon={"ph:download-duotone"} />
                              Download
                            </Link>
                          </Typography>
                        </Typography>
                      );
                    }
                  })} */}
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography>User Documents</Typography>
                <Card>
                  {userDocuments.map((d) => {
                    if (d?.attributes?.document?.data) {
                      return d.attributes?.document?.data?.map((k) => (
                        <Typography>
                          {k?.attributes?.name}-&nbsp;&nbsp;{"   "}
                          <Typography component={"span"} fontSize={12}>
                            <Link target="__blank" href={k.attributes?.url}>
                              <Icon icon={"ph:download-duotone"} />
                              Download
                            </Link>
                          </Typography>
                        </Typography>
                      ));
                    } else {
                      return (
                        <Typography>
                          {d?.attributes?.name}-&nbsp;&nbsp;{"   "}
                          <Typography component={"span"} fontSize={12}>
                            <Link target="__blank" href={d?.attributes?.url}>
                              <Icon icon={"ph:download-duotone"} />
                              Download
                            </Link>
                          </Typography>
                        </Typography>
                      );
                    }
                  })}
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography>Payment Transactions</Typography>
                <Card>
                  <TableContainer component={Box}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Trx Date</TableCell>
                          <TableCell align="right">Status</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell align="right">Paid For</TableCell>
                          <TableCell align="right">Payment Method</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.attributes.transactionDate}
                            </TableCell>
                            <TableCell align="right">
                              {row.attributes.status}
                            </TableCell>
                            <TableCell align="right">
                              {row.attributes.value}
                            </TableCell>
                            <TableCell align="right">
                              {row.attributes.paymentFor}
                            </TableCell>
                            <TableCell align="right">
                              {row.attributes.paymentMethod}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip arrow title="Invoice">
                                <IconButton
                                  onClick={() =>
                                    openUrl(
                                      `/admin/plugins/${pluginId}/user-wallets/invoice/${row.id}`,
                                      "__blank"
                                    )
                                  }
                                >
                                  <Icon icon={"iconamoon:invoice-duotone"} />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography>Service History</Typography>
                <Card>
                  <TableContainer component={Box}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Booking Date</TableCell>
                          <TableCell>Service</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Comments</TableCell>
                          <TableCell>Payment</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {serviceHistory?.map((row) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.attributes.bookingDate}
                            </TableCell>
                            <TableCell>
                              {row.attributes?.service?.data?.attributes?.name}
                            </TableCell>
                            <TableCell>{row.attributes.status}</TableCell>
                            <TableCell>{row.attributes.comments}</TableCell>
                            <TableCell>
                              {row.attributes?.payment?.data?.attributes?.value}
                            </TableCell>
                            <TableCell>
                              <Tooltip arrow title="Go To Detail">
                                <IconButton
                                  onClick={() =>
                                    openUrl(
                                      `/admin/content-manager/collectionType/api::service-booking.service-booking/${row.id}`,
                                      "__blank"
                                    )
                                  }
                                >
                                  <Icon icon={"mingcute:link-fill"} />
                                </IconButton>
                              </Tooltip>
                              Go To Detail
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <Typography fontSize={24} fontWeight={600}>
                    Wallet Balance
                  </Typography>
                  <Typography fontSize={18}>₹{walletBalance}/-</Typography>
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
              {!!user.phr?.id && (
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() =>
                    openUrl(`/api/phr/pdf/${user.phr?.id ?? 1}`, "__blank")
                  }
                >
                  PHR
                </Button>
              )}
              {!!user.user_detail?.id && (
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={() =>
                    openUrl(
                      `/api/user/epr/pdf/${user.user_detail?.id ?? 1}`,
                      "__blank"
                    )
                  }
                >
                  EPR
                </Button>
              )}

              {!!(phr.diagnosedServices && phr.diagnosedServices.length) && (
                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={() =>
                    openUrl(
                      `/admin/plugins/${pluginId}/user-wallets/phr/diagnostic/${phr.id}`,
                      "__blank"
                    )
                  }
                >
                  Diagnostic Graphs
                </Button>
              )}

              {!!(phr.diagnosedServices && phr.diagnosedServices.length) && (
                <Button
                  variant="outlined"
                  fullWidth
                  color="primary"
                  onClick={() =>
                    openUrl(
                      `/admin/plugins/${pluginId}/user-wallets/phr/vitals/${phr.id}`,
                      "__blank"
                    )
                  }
                >
                  Vitals Graphs
                </Button>
              )}

              <Button
                variant="outlined"
                fullWidth
                color="primary"
                onClick={() =>
                  openUrl(
                    `/admin/content-manager/collectionType/api::user-food-log.user-food-log?page=1&pageSize=100&sort=id:ASC&filters[$and][0][user][username][$containsi]=${user.firstName}`,
                    "__blank"
                  )
                }
              >
                Food Logs
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
