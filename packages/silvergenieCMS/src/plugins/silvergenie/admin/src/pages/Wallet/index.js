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
import { Icon } from "@iconify/react";
import { Link as RDLink } from "react-router-dom";

import { Grid, Typography, CircularProgress, Link } from "@mui/material";
const baseRoute = `/plugins/${pluginId}/user-wallets`;
const HomePage = (props) => {
  // const cme = useCMEditViewDataManager();
  // console.log(props, cme);
  const [premiumUsers, setPremiumUsers] = useState([]);

  const getUserData = async () => {
    const data = "";
    try {
      const data = await axios("/api/users", {
        method: "GET",
        params: {
          filters: {
            // userType: "superPremium",
            userTags: { $containsi: "superPremium" },
          },
        },
      });
      // console.log("🚀 ~ file: index.js:18 ~ getUserData ~ data:", data);
      setPremiumUsers(data.data);
    } catch (error) {
      console.error("🚀 ~ file: index.js:22 ~ getUserData ~ error:", error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
  return (
    <Layout>
      <HeaderLayout
        title="User Vault"
        subtitle="Vault Management for Super Premium Users"
        as="h2"
      />
      <ContentLayout>
        <Grid container spacing={1}>
          {premiumUsers.map((user) => (
            <Grid item xs={12} md={4}>
              <Link
                // href={`${baseRoute}/${user.id}`}
                sx={{ textDecoration: "none", color: "#000" }}
                // target="__blank"
                component={RDLink}
                to={`${baseRoute}/${user.id}`}
              >
                <Box
                  shadow="filterShadow"
                  padding={6}
                  borderRadius="4px"
                  marginBottom="24px"
                  background="neutral0"
                >
                  <Typography>
                    <Icon icon={"icon-park-outline:edit-name"} />
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      mr={1}
                      ml={0.5}
                    >
                      Name:
                    </Typography>
                    &nbsp;
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography>
                    <Icon icon={"iconamoon:email-duotone"} />
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      mr={1}
                      ml={0.5}
                    >
                      Email:
                    </Typography>
                    &nbsp;
                    {user.email}
                  </Typography>
                  <Typography>
                    <Icon icon={"ph:gender-male-bold"} />
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      mr={1}
                      ml={0.5}
                    >
                      Gender:
                    </Typography>
                    &nbsp;
                    {user.gender}
                  </Typography>
                  <Typography>
                    <Icon icon={"ic:twotone-phone"} />
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      mr={1}
                      ml={0.5}
                    >
                      Phone:
                    </Typography>
                    &nbsp;
                    {user.phoneNumber}
                  </Typography>
                  <Typography>
                    <Icon icon={"ic:baseline-date-range"} />
                    <Typography
                      fontWeight={600}
                      component={"span"}
                      mr={1}
                      ml={0.5}
                    >
                      DOB:
                    </Typography>
                    &nbsp;
                    {user.dateOfBirth}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          ))}
        </Grid>
      </ContentLayout>
    </Layout>
  );
};

export default HomePage;
