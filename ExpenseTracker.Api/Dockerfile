FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["ExpenseTracker.Api.csproj", "./"]
RUN dotnet restore "ExpenseTracker.Api.csproj"

COPY . .
RUN dotnet publish "ExpenseTracker.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends libgssapi-krb5-2 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ExpenseTracker.Api.dll"]