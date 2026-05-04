import { Scheme } from './types';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'mr', name: 'Marathi' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'bn', name: 'Bengali' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ml', name: 'Malayalam' }
];

export const MOCK_SCHEMES: Scheme[] = [
    { id: 1, state: 'Maharashtra', name: 'Mahatma Jyotirao Phule Shetkari Karjmukti Yojana', description: 'A loan waiver scheme for farmers in Maharashtra.', link: 'https://mjpsky.maharashtra.gov.in/', status: 'Active' },
    { id: 2, state: 'Uttar Pradesh', name: 'PM-Kisan Samman Nidhi', description: 'Provides income support to all landholding farmer families in the country.', link: 'https://pmkisan.gov.in/', status: 'Active' },
    { id: 3, state: 'Punjab', name: 'Kheti Vikas Scheme', description: 'Aims to promote modern agricultural practices and provide subsidies for machinery.', link: 'https://agri.punjab.gov.in/?page_id=361', status: 'Inactive' },
    { id: 4, state: 'Karnataka', name: 'Raitha Siri Scheme', description: 'Provides financial assistance to millet growers.', link: 'https://raitamitra.karnataka.gov.in/', status: 'Active' },
    { id: 5, state: 'Andhra Pradesh', name: 'YSR Rythu Bharosa', description: 'Financial assistance to farmers for investment support.', link: 'https://ysrrythubharosa.ap.gov.in/', status: 'Active' },
    { id: 6, state: 'Maharashtra', name: 'Nanaji Deshmukh Krishi Sanjivani Yojana', description: 'Promotes climate-resilient agriculture to improve farm productivity and farmer income.', link: 'https://dbt.mahapocra.gov.in/', status: 'Active' },
    { id: 7, state: 'Maharashtra', name: 'Jalyukt Shivar Abhiyan', description: 'A water conservation program aimed at making Maharashtra drought-free.', link: 'https://www.maharashtra.gov.in/1125/Jalyukta-Shivar-Abhiyan', status: 'Inactive' },
    { id: 8, state: 'Maharashtra', name: 'Gopinath Munde Shetkari Apghat Vima Yojana', description: 'Provides insurance cover to farmers in case of accidental death or disability.', link: 'https://krishi.maharashtra.gov.in/1029/Gopinath-Munde-Shetkari-Apghat-Vima-Yojana', status: 'Active' },
    { id: 9, state: 'Uttar Pradesh', name: 'UP Kisan Karj Rahat Yojana', description: 'A farm loan waiver scheme for small and marginal farmers.', link: 'https://www.upkisankarjrahat.upsdc.gov.in/', status: 'Active' },
    { id: 10, state: 'Uttar Pradesh', name: 'Mukhya Mantri Kisan Evam Sarvhit Bima Yojana', description: 'Provides insurance coverage to farmers and their families for accidental death or disability.', link: 'http://upagripardarshi.gov.in/', status: 'Inactive' },
    { id: 11, state: 'Punjab', name: 'Rashtriya Krishi Vikas Yojana (RKVY)', description: 'Aims to achieve 4% annual growth in the agriculture sector by ensuring a holistic development of agriculture and allied sectors.', link: 'https://rkvy.nic.in/', status: 'Active' },
    { id: 12, state: 'Karnataka', name: 'Krishi Bhagya', description: 'A scheme to promote sustainable agriculture through efficient use of water resources.', link: 'https://raitamitra.karnataka.gov.in/info-3/Krishi+Bhagya/en', status: 'Active' },
    { id: 13, state: 'Andhra Pradesh', name: 'Dr. YSR Polambadi', description: 'A program to educate farmers on the latest agricultural technologies and practices.', link: 'https://apagrisnet.gov.in/', status: 'Active' },
    { id: 14, state: 'Gujarat', name: 'Kisan Suryoday Yojana', description: 'Provides day-time electricity supply for irrigation purposes to farmers.', link: 'https://ged.gujarat.gov.in/kisan-suryoday-yojna.htm', status: 'Active' },
    { id: 15, state: 'Rajasthan', name: 'Mukhyamantri Beej Swavalamban Yojana', description: 'Encourages farmers to produce their own high-quality seeds.', link: 'https://rajkisan.rajasthan.gov.in/Home/Scheme/17', status: 'Active' },
    { id: 16, state: 'West Bengal', name: 'Krishak Bandhu Scheme', description: 'Provides financial assistance to farmers, including death benefits.', link: 'https://krishakbandhu.net/', status: 'Active' },
    { id: 17, state: 'Arunachal Pradesh', name: 'Chief Minister Sashakt Kisan Yojana', description: 'A scheme to provide tractors and power tillers to farmers at subsidized rates.', link: 'https://agri.arunachal.gov.in/', status: 'Active' },
    { id: 18, state: 'Arunachal Pradesh', name: 'Deen Dayal Upadhyaya Swavalamban Yojana', description: 'Provides financial assistance for setting up small and medium enterprises in agriculture.', link: 'https://www.ddusy.arunachal.gov.in/', status: 'Active' },
    { id: 19, state: 'Arunachal Pradesh', name: 'Atal Amrit Abhiyan', description: 'A health insurance scheme covering farmers and their families.', link: 'https://cmaay.arunachal.gov.in/', status: 'Active' },
    { id: 20, state: 'Assam', name: 'Mukhya Mantri Krishi Sa Sajuli Yojana', description: 'Provides financial assistance to farmers for procuring agricultural tools.', link: 'https://diragri.assam.gov.in/portlet-innerpage/schemes-under-directorate-of-agriculture', status: 'Active' },
    { id: 21, state: 'Assam', name: 'Assam Agribusiness and Rural Transformation Project (APART)', description: 'A World Bank-funded project to promote climate-resilient agriculture.', link: 'https://www.arias.in/apart.html', status: 'Inactive' },
    { id: 22, state: 'Assam', name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY) Assam', description: 'Crop insurance scheme to protect against crop loss.', link: 'https://pmfby.gov.in/', status: 'Active' },
    { id: 23, state: 'Bihar', name: 'Bihar Rajya Fasal Sahayata Yojana', description: 'Provides financial aid to farmers in case of crop damage due to natural calamities.', link: 'https://pacsonline.bih.nic.in/fsy/', status: 'Active' },
    { id: 24, state: 'Bihar', name: 'Krishi Input Subsidy Scheme', description: 'Provides subsidy on seeds, fertilizers, and other agricultural inputs.', link: 'https://dbtagriculture.bihar.gov.in/', status: 'Active' },
    { id: 25, state: 'Bihar', name: 'Chief Minister Horticulture Mission', description: 'Promotes cultivation of fruits, vegetables, and flowers.', link: 'http://horticulture.bihar.gov.in/', status: 'Active' },
    { id: 26, state: 'Chhattisgarh', name: 'Rajiv Gandhi Kisan Nyay Yojana', description: 'Provides financial assistance to farmers based on the area of cultivation.', link: 'https://rgkny.cg.nic.in/', status: 'Active' },
    { id: 27, state: 'Chhattisgarh', name: 'Godhan Nyay Yojana', description: 'Government procures cow dung from farmers, promoting organic farming.', link: 'https://godhan.cg.nic.in/', status: 'Active' },
    { id: 28, state: 'Chhattisgarh', name: 'Saur Sujala Yojana', description: 'Provides solar-powered irrigation pumps to farmers at subsidized rates.', link: 'https://creda.cg.state.gov.in/ssyphase1.htm', status: 'Active' },
    { id: 29, state: 'Goa', name: 'Goa State Agricultural Mechanization Scheme', description: 'Provides subsidies for the purchase of agricultural machinery.', link: 'https://agri.goa.gov.in/schemes-and-programmes/', status: 'Active' },
    { id: 30, state: 'Goa', name: 'Sheti Sahay Nidhi', description: 'Financial assistance for farmers to improve their agricultural infrastructure.', link: 'https://agri.goa.gov.in/schemes-and-programmes/', status: 'Active' },
    { id: 31, state: 'Goa', name: 'Marine Fisheries Scheme', description: 'Provides support to farmers engaged in aquaculture and fisheries.', link: 'https://fisheries.goa.gov.in/schemes/', status: 'Active' },
    { id: 32, state: 'Haryana', name: 'Bhavantar Bharpai Yojana', description: 'Compensates farmers for the difference between market price and MSP for vegetables.', link: 'https://hsamb.org.in/bby.html', status: 'Active' },
    { id: 33, state: 'Haryana', name: 'Mera Pani Meri Virasat', description: 'Encourages farmers to diversify from paddy to other less water-intensive crops.', link: 'https://www.merapanimerivirasat.in/', status: 'Active' },
    { id: 34, state: 'Haryana', name: 'Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)', description: 'Promotes the use of solar pumps.', link: 'https://hareda.gov.in/en/schemes-programmes/pm-kusum', status: 'Active' },
    { id: 35, state: 'Himachal Pradesh', name: 'Mukhya Mantri Khet Sanrakshan Yojana', description: 'Provides subsidies for solar fencing to protect crops from wild animals.', link: 'https://www.hpagrisnet.gov.in/hpagris/Agriculture/Default.aspx?PageID=1130', status: 'Active' },
    { id: 36, state: 'Himachal Pradesh', name: 'Jal Se Krishi Ko Bal', description: 'Scheme for construction of check dams and ponds for irrigation.', link: 'https://hpagriculture.nic.in/Schemes/State-Sector-Schemes', status: 'Active' },
    { id: 37, state: 'Himachal Pradesh', name: 'Prakritik Kheti Khushal Kisan Yojana', description: 'Promotes natural farming practices.', link: 'http://spnf.hp.gov.in/', status: 'Active' },
    { id: 38, state: 'Jharkhand', name: 'Mukhya Mantri Krishi Ashirwad Yojana', description: 'Provides direct income support to small and marginal farmers.', link: 'https://mmkay.jharkhand.gov.in/', status: 'Active' },
    { id: 39, state: 'Jharkhand', name: 'Johar Yojana', description: 'Aims to double the income of rural households, including farmers.', link: 'https://www.jslps.org/johar/', status: 'Active' },
    { id: 40, state: 'Jharkhand', name: 'Jharkhand Farm Loan Waiver Scheme', description: 'Waives off farm loans up to a certain limit.', link: 'https://jkrmy.jharkhand.gov.in/', status: 'Inactive' },
    { id: 41, state: 'Kerala', name: 'Paddy Rice Development Scheme', description: 'Provides support to increase paddy cultivation and productivity.', link: 'https://www.keralaagriculture.gov.in/category/schemes/', status: 'Active' },
    { id: 42, state: 'Kerala', name: 'Coconut Development Board Subsidies', description: 'Various subsidies for coconut cultivation, processing, and marketing.', link: 'https://www.coconutboard.gov.in/', status: 'Active' },
    { id: 43, state: 'Kerala', name: 'Jaiva Krishi Mission', description: 'Promotes organic farming across the state.', link: 'https://www.keralaagriculture.gov.in/category/schemes/', status: 'Active' },
    { id: 44, state: 'Madhya Pradesh', name: 'Mukhya Mantri Kisan Kalyan Yojana', description: 'Provides additional income support to PM-Kisan beneficiaries.', link: 'https://saara.mp.gov.in/mmkky/', status: 'Active' },
    { id: 45, state: 'Madhya Pradesh', name: 'Jai Kisan Rin Mukti Yojana', description: 'A farm loan waiver scheme for farmers in the state.', link: 'http://mpkrishi.mp.gov.in/hindisite/JKRMY.aspx', status: 'Active' },
    { id: 46, state: 'Madhya Pradesh', name: 'Bhavantar Bhugtan Yojana', description: 'Provides price deficit financing to farmers for certain crops.', link: 'http://mpkrishi.mp.gov.in/hindisite/BhavantarYojana.aspx', status: 'Active' },
    { id: 47, state: 'Manipur', name: 'Manipur Organic Mission Agency (MOMA)', description: 'Promotes organic farming of specific crops like pineapple and ginger.', link: 'https://moma.mn.gov.in/', status: 'Active' },
    { id: 48, state: 'Manipur', name: 'Chief Ministergi Shotharabasingi Tengbang', description: 'A pension scheme for old and marginal farmers.', link: 'https://socialwelfare.mn.gov.in/', status: 'Active' },
    { id: 49, state: 'Manipur', name: 'Loktak Livelihood Mission', description: 'Supports farmers dependent on the Loktak Lake ecosystem.', link: 'https://forest.manipur.gov.in/loktak-livelihood-mission/', status: 'Active' },
    { id: 50, state: 'Meghalaya', name: 'Meghalaya Milk Mission', description: 'Aims to boost milk production and provide livelihood to farmers.', link: 'https://meganimalhusbandry.gov.in/schemes/centrally_sponsored_scheme_1', status: 'Active' },
    { id: 51, state: 'Meghalaya', name: 'Lakadong Turmeric Mission', description: 'Promotes the cultivation of the high-curcumin Lakadong turmeric.', link: 'https://www.meghalaya.gov.in/whatsnew/mission-lakadong', status: 'Active' },
    { id: 52, state: 'Meghalaya', name: 'FOCUS - Farmers Collectivization for Upscaling Production and Marketing Systems', description: 'Supports farmer producer organizations (FPOs).', link: 'https://focusmeghalaya.org/', status: 'Active' },
    { id: 53, state: 'Mizoram', name: 'Socio-Economic Development Policy (SEDP)', description: 'Provides financial assistance to farmers under its agriculture and allied sectors component.', link: 'https://sedp.mizoram.gov.in/', status: 'Active' },
    { id: 54, state: 'Mizoram', name: 'Mizoram Crop Insurance Scheme', description: 'A state-level crop insurance scheme.', link: 'https://agriculture.mizoram.gov.in/page/list-of-schemes', status: 'Active' },
    { id: 55, state: 'Mizoram', name: 'National Bamboo Mission (State Chapter)', description: 'Promotes bamboo cultivation and industry.', link: 'https://agriculture.mizoram.gov.in/page/national-bamboo-mission-nbm', status: 'Active' },
    { id: 56, state: 'Nagaland', name: 'Nagaland Honey Mission', description: 'Promotes beekeeping and honey production.', link: 'https://nbhm.nagaland.gov.in/', status: 'Active' },
    { id: 57, state: 'Nagaland', name: 'Trees for Wealth Mission', description: 'Encourages farmers to plant trees for long-term income.', link: 'https://www.nfmpjica.org/', status: 'Active' },
    { id: 58, state: 'Nagaland', name: 'Chief Minister’s Corpus Fund', description: 'Provides support for various agricultural and allied activities.', link: 'https://idan.nagaland.gov.in/', status: 'Active' },
    { id: 59, state: 'Odisha', name: 'KALIA (Krushak Assistance for Livelihood and Income Augmentation)', description: 'A comprehensive support scheme for farmers.', link: 'https://kalia.odisha.gov.in/', status: 'Active' },
    { id: 60, state: 'Odisha', name: 'Balaram Yojana', description: 'Provides agricultural credit to landless farmers.', link: 'https://agri.odisha.gov.in/sites/default/files/2020-07/Balaram%20Scheme.pdf', status: 'Active' },
    { id: 61, state: 'Odisha', name: 'Odisha Millet Mission', description: 'Promotes the cultivation and consumption of millets.', link: 'https://milletmission.odisha.gov.in/', status: 'Active' },
    { id: 62, state: 'Sikkim', name: 'Sikkim Organic Mission', description: 'Supports the state\'s status as a fully organic farming state.', link: 'http://www.sikkimorganicmission.gov.in/', status: 'Active' },
    { id: 63, state: 'Sikkim', name: 'Chief Minister’s Rural Housing Mission', description: 'Provides housing support for rural families, including farmers.', link: 'https://sikkim.gov.in/departments/rural-development-department/schemes-and-programmes/chief-minister-s-rural-housing-mission', status: 'Active' },
    { id: 64, state: 'Sikkim', name: 'Dairy Development Scheme', description: 'Provides subsidies for dairy farming.', link: 'https://sikkim.gov.in/departments/animal-husbandry-and-veterinary-services/schemes-and-programmes', status: 'Active' },
    { id: 65, state: 'Tamil Nadu', name: 'Uzhavan Santhai Scheme', description: 'Enables farmers to sell their produce directly to consumers.', link: 'https://www.agritech.tnau.ac.in/govt_schemes_services/govt_serv_Agri_Marketing_uzhavar_sandhai.html', status: 'Active' },
    { id: 66, state: 'Tamil Nadu', name: 'TNAU Crop Advisory Program', description: 'Provides expert advisory services through Tamil Nadu Agricultural University.', link: 'https://agritech.tnau.ac.in/', status: 'Active' },
    { id: 67, state: 'Tamil Nadu', name: 'Neera Thadagam Scheme', description: 'Focuses on water body restoration for irrigation.', link: 'https://www.wrd.tn.gov.in/kudimaramathu.htm', status: 'Active' },
    { id: 68, state: 'Telangana', name: 'Rythu Bandhu Scheme', description: 'Provides investment support to farmers for two crops a year.', link: 'https://rythubandhu.telangana.gov.in/', status: 'Active' },
    { id: 69, state: 'Telangana', name: 'Rythu Bima', description: 'A life insurance scheme for farmers.', link: 'https://rythubima.telangana.gov.in/', status: 'Active' },
    { id: 70, state: 'Telangana', name: 'Kaleshwaram Lift Irrigation Project', description: 'A major irrigation project to provide water for agriculture.', link: 'https://irrigation.telangana.gov.in/icad/projects/kaleshwaram', status: 'Active' },
    { id: 71, state: 'Tripura', name: 'Chief Minister’s Fasal Bima Yojana', description: 'State-supported crop insurance scheme.', link: 'https://agri.tripura.gov.in/schemes', status: 'Active' },
    { id: 72, state: 'Tripura', name: 'Tripura Bamboo Mission', description: 'Promotes bamboo cultivation and related industries.', link: 'https://industries.tripura.gov.in/tbm', status: 'Active' },
    { id: 73, state: 'Tripura', name: 'Mukhyamantri Swanirbhar Parivar Yojana', description: 'Provides support for self-reliant families, including those in agriculture.', link: 'https://tripura.gov.in/mukhyamantri-swanirbhar-parivar-yojana', status: 'Active' },
    { id: 74, state: 'Uttarakhand', name: 'Mukhya Mantri Rajya Krishi Vikas Yojana', description: 'A comprehensive scheme for agricultural development.', link: 'https://agriculture.uk.gov.in/pages/display/131-schemes', status: 'Active' },
    { id: 75, state: 'Uttarakhand', name: 'Ghasyari Kalyan Yojana', description: 'Provides fodder at subsidized rates, supporting livestock farmers.', link: 'https://ghasyari.uk.gov.in/', status: 'Active' },
    { id: 76, state: 'Uttarakhand', name: 'Deendayal Upadhyay Sahkarita Kisan Kalyan Yojana', description: 'Provides interest-free loans to farmers.', link: 'https://cooperative.uk.gov.in/pages/display/66-deendayal-upadhyay-sehkarita-kisan-kalyan-yojna', status: 'Active' }
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", 
  "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", 
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", 
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const INDIAN_MARKETS = [
    "Azadpur, Delhi", "Vashi, Mumbai", "Koyambedu, Chennai", "Ghazipur, Delhi",
    "Mechua, Kolkata", "Yeshwanthpur, Bengaluru", "Kothapet, Hyderabad"
];

export const CROPS = [
    "Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Soybean", "Potato", "Tomato", "Onion", "Mango", "Mustard", "Bajra", "Jowar"
];

export const INDIAN_LANGUAGES = SUPPORTED_LANGUAGES.map(lang => lang.name);

export const ADVISORY_TOPICS = [
    "Water Requirements", "Fertilizer Usage", "Soil Type Suitability"
];