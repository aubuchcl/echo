#!/bin/sh

curl --unix-socket /var/run/cycle/api/api.sock http://internal.cycle/v1/environment/scoped-variables -H "x-cycle-token: $CYCLE_API_TOKEN"
