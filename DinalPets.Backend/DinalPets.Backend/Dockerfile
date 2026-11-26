FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["DinalPets.Backend.csproj", "./"]
RUN dotnet restore "DinalPets.Backend.csproj"
COPY . .
RUN dotnet publish "DinalPets.Backend.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DinalPets.Backend.dll"]