/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from "react";
import { Switch, Route } from "react-router-dom";
import { AnErrorOccurred } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";
import Reports from "../Reports";
import Wallet from "../Wallet";
import WalletUser from "../Wallet/User";
import Invoice from "../Wallet/Invoice";
import { Diagnostics, Vitals } from "../Wallet/phr";
import Foodlog from "../Wallet/foodlog";

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}/report`} component={Reports} exact />
        <Route
          path={`/plugins/${pluginId}/user-wallets`}
          component={Wallet}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/user-wallets/:userId`}
          component={WalletUser}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/user-wallets/invoice/:paymentId`}
          component={Invoice}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/user-wallets/phr/diagnostic/:phrId`}
          component={Diagnostics}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/user-wallets/phr/vitals/:phrId`}
          component={Vitals}
          exact
        />
        <Route
          path={`/plugins/${pluginId}/user-wallets/foodlogs/:userId`}
          component={Foodlog}
          exact
        />
        <Route component={AnErrorOccurred} />
      </Switch>
    </div>
  );
};

export default App;
