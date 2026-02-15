# -------- BUILD STAGE --------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .

RUN dotnet restore dotnet/ExpenseTracker.Api/ExpenseTracker.Api.csproj
RUN dotnet publish dotnet/ExpenseTracker.Api/ExpenseTracker.Api.csproj -c Release -o /app/publish

# -------- RUNTIME STAGE --------
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

# Install required runtime libs
RUN apt-get update \
  && apt-get install -y --no-install-recommends libgssapi-krb5-2 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ExpenseTracker.Api.dll"]
