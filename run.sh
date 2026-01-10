cd "$(dirname "$0")"

if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:8000
else
    xdg-open http://localhost:8000
fi

python3 -m http.server 8000