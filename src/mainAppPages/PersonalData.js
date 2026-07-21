import React, { useEffect, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '/personal-data', name: 'Personal Data', id: 2 },
];

const formatLabel = (value) => {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

function PersonalData() {
  const { userData, organization, setCurrentUrl } = useContext(CompleteDataContext);
  const location = useLocation();

  useEffect(() => {
    setCurrentUrl(location.pathname);
  }, [location.pathname, setCurrentUrl]);

  const branchName = useMemo(() => {
    const branches = organization?.branches;
    if (!Array.isArray(branches) || !userData?.branch_id) return null;

    const match = branches.find(
      (branch) =>
        String(branch.branch_id) === String(userData.branch_id) ||
        String(branch.id) === String(userData.branch_id)
    );

    return match?.name || null;
  }, [organization, userData]);

  const organisationName = organization?.name;
  const avatarImage = organization?.image;
  const avatarSrc = organisationName
    ? `https://backend.wyreng.com${avatarImage}`
    : '/wyreLogo.png';

  const accountFields = [
    { label: 'Username', value: userData?.username },
    { label: 'Role', value: userData?.role_text },
    { label: 'User ID', value: userData?.id ?? userData?.user_id },
    {
      label: 'Solar Customer',
      value: userData?.is_solar_customer,
    },
  ];

  const organisationFields = [
    { label: 'Organisation', value: organisationName },
    { label: 'Client', value: userData?.client },
    { label: 'Client Type', value: userData?.client_type },
    { label: 'Branch', value: branchName || userData?.branch_id },
  ];

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div className="personal-data-content-wrapper">
        <h1 className="center-main-heading">Personal Data</h1>

        <div className="personal-data-profile">
          <img
            className="personal-data-avatar"
            src={avatarSrc}
            alt={
              organisationName
                ? `Avatar for ${organisationName}`
                : 'Organisation avatar'
            }
          />
          <div className="personal-data-profile-text">
            <p className="personal-data-profile-name">
              {formatLabel(userData?.username)}
            </p>
            <p className="personal-data-profile-org">
              {formatLabel(organisationName)}
            </p>
          </div>
        </div>

        <section className="personal-data-section">
          <h2 className="personal-data-section-heading">Account</h2>
          <div className="personal-data-fields">
            {accountFields.map(({ label, value }) => (
              <div className="personal-data-field" key={label}>
                <span className="personal-data-field-label">{label}</span>
                <span className="personal-data-field-value">
                  {formatLabel(value)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="personal-data-section">
          <h2 className="personal-data-section-heading">Organisation</h2>
          <div className="personal-data-fields">
            {organisationFields.map(({ label, value }) => (
              <div className="personal-data-field" key={label}>
                <span className="personal-data-field-label">{label}</span>
                <span className="personal-data-field-value">
                  {formatLabel(value)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default PersonalData;
