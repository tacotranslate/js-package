import {useTranslate} from 'tacotranslate';
import LocaleSelector from '../components/locale-selector';
import Wrapper from '../components/wrapper';
import getAppServerSideProps from '../utilities/get-app-server-side-props';

const Page = ({outputLocale}) => {
	const Translate = useTranslate();

	return (
		<Wrapper>
			<LocaleSelector initialLocale={outputLocale} />

			<h1>
				<Translate string="<span translate='no'>Hola</span>, world! Welcome to TacoTranslate." />
			</h1>

			<p style={{fontFamily: 'sans-serif', lineHeight: 1.6}}>
				<Translate string="TacoTranslate is a service that automatically translates your React application to any language in minutes. Join us in saying <span translate='no'>adiós</span> to JSON files, and <a href='https://tacotranslate.com'>set up your free TacoTranslate account</a> today!<br><br>Out of the box, you’ll get to translate one language for free. In addition, we are collaborating with one the top translation providers in the world, should you need to get a more accurate translation than what machine learning can provide.<br><br><a href='https://tacotranslate.com'>Sign up now, <span translate='no'>amigo</span>!</a>" />
			</p>
		</Wrapper>
	);
};

export async function getServerSideProps(context) {
	return getAppServerSideProps(context);
}

export default Page;
