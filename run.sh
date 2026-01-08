#!/bin/bash
if[[ "$OSTYPE" == "darwin"* ]]; then
  open index.html
else 
  xdg-open index.html
fi