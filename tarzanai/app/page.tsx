// WELCOME PAGE DISABLED — restore LandingPage component here to re-enable

import { redirect } from 'next/navigation';

export default function LandingPage() {
  redirect('/main/dashboard');
}
