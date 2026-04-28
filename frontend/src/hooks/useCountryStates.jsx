function useCountryStates() {
    const useCountries = async () => {
        try {
            // const countriesResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
            // const countriesData = await countriesResponse.json();

            // const countries = countriesData.map(country => ({
            //     name: country.name.common,
            //     code: country.cca2,
            //     states: []
            // })).sort((a, b) => a.name.localeCompare(b.name));

            // return countries;
            return [{
                name: 'United States',
                code: 'US',
                states: []
            }]
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    };

    const useStatesByCountry = async (countryCode = 'US') => {
        try {
            // Original GeoNames API code - commented out due to 401 authentication error
            // const username = 'chris_folayan'; // Your username
            
            // // Use the countryInfo endpoint to get the geonameId first
            // const countryInfoResponse = await fetch(
            //     `https://secure.geonames.org/countryInfoJSON?country=${countryCode}&username=${username}`
            // );
            
            // const countryInfo = await countryInfoResponse.json();
            // console.log(countryInfo)
            
            // if (countryInfo.geonames && countryInfo.geonames.length > 0) {
            //     const geonameId = countryInfo.geonames[0].geonameId;
                
            //     // Now fetch the states using the correct geonameId
            //     const statesResponse = await fetch(
            //         `https://secure.geonames.org/childrenJSON?geonameId=${geonameId}&username=${username}`
            //     );
                
            //     const statesData = await statesResponse.json();
                
            //     if (statesData.geonames) {
            //         return statesData.geonames.map(state => ({
            //             name: state.name,
            //             code: state.adminCode1 || state.fcode,
            //             id: state.geonameId
            //         }));
            //     }
            // }
            
            // Hardcoded US states data
            const usStates = [
                { name: 'Alabama', code: 'AL', id: 1 },
                { name: 'Alaska', code: 'AK', id: 2 },
                { name: 'Arizona', code: 'AZ', id: 3 },
                { name: 'Arkansas', code: 'AR', id: 4 },
                { name: 'California', code: 'CA', id: 5 },
                { name: 'Colorado', code: 'CO', id: 6 },
                { name: 'Connecticut', code: 'CT', id: 7 },
                { name: 'Delaware', code: 'DE', id: 8 },
                { name: 'Florida', code: 'FL', id: 9 },
                { name: 'Georgia', code: 'GA', id: 10 },
                { name: 'Hawaii', code: 'HI', id: 11 },
                { name: 'Idaho', code: 'ID', id: 12 },
                { name: 'Illinois', code: 'IL', id: 13 },
                { name: 'Indiana', code: 'IN', id: 14 },
                { name: 'Iowa', code: 'IA', id: 15 },
                { name: 'Kansas', code: 'KS', id: 16 },
                { name: 'Kentucky', code: 'KY', id: 17 },
                { name: 'Louisiana', code: 'LA', id: 18 },
                { name: 'Maine', code: 'ME', id: 19 },
                { name: 'Maryland', code: 'MD', id: 20 },
                { name: 'Massachusetts', code: 'MA', id: 21 },
                { name: 'Michigan', code: 'MI', id: 22 },
                { name: 'Minnesota', code: 'MN', id: 23 },
                { name: 'Mississippi', code: 'MS', id: 24 },
                { name: 'Missouri', code: 'MO', id: 25 },
                { name: 'Montana', code: 'MT', id: 26 },
                { name: 'Nebraska', code: 'NE', id: 27 },
                { name: 'Nevada', code: 'NV', id: 28 },
                { name: 'New Hampshire', code: 'NH', id: 29 },
                { name: 'New Jersey', code: 'NJ', id: 30 },
                { name: 'New Mexico', code: 'NM', id: 31 },
                { name: 'New York', code: 'NY', id: 32 },
                { name: 'North Carolina', code: 'NC', id: 33 },
                { name: 'North Dakota', code: 'ND', id: 34 },
                { name: 'Ohio', code: 'OH', id: 35 },
                { name: 'Oklahoma', code: 'OK', id: 36 },
                { name: 'Oregon', code: 'OR', id: 37 },
                { name: 'Pennsylvania', code: 'PA', id: 38 },
                { name: 'Rhode Island', code: 'RI', id: 39 },
                { name: 'South Carolina', code: 'SC', id: 40 },
                { name: 'South Dakota', code: 'SD', id: 41 },
                { name: 'Tennessee', code: 'TN', id: 42 },
                { name: 'Texas', code: 'TX', id: 43 },
                { name: 'Utah', code: 'UT', id: 44 },
                { name: 'Vermont', code: 'VT', id: 45 },
                { name: 'Virginia', code: 'VA', id: 46 },
                { name: 'Washington', code: 'WA', id: 47 },
                { name: 'West Virginia', code: 'WV', id: 48 },
                { name: 'Wisconsin', code: 'WI', id: 49 },
                { name: 'Wyoming', code: 'WY', id: 50 }
            ];
            
            return usStates;
        } catch (error) {
            console.error('Error fetching states:', error);
            return [];
        }
    };
    
    return {useCountries, useStatesByCountry};
}

export default useCountryStates;