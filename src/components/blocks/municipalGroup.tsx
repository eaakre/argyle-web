import React from "react";
import { Phone, Mail, Clock, MapPin, Calendar, Users } from "lucide-react";
import { MunicipalGroupData } from "@/types/cms";

export function MunicipalGroup({
  title,
  groupType,
  description,
  members = [],
  meetingInfo,
  officeHours,
  contactInfo,
  additionalContent = [],
  specialNotices = [],
  displaySettings,
}: MunicipalGroupData) {
  // Filter active members and sort by display order
  const activeMembers = members
    .filter((member) => member.isActive)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // Filter active notices
  const activeNotices = specialNotices.filter((notice) => notice.isActive);

  // Get grid classes based on columns per row
  const getGridCols = (cols: number) => {
    switch (cols) {
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2";
    }
  };

  const formatPhoneNumber = (phone: string, extension?: string) => {
    const formatted = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    return extension ? `${formatted} ext. ${extension}` : formatted;
  };

  const isCurrentDate = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return true;
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date("1900-01-01");
    const end = endDate ? new Date(endDate) : new Date("2100-01-01");
    return now >= start && now <= end;
  };

  const currentNotices = activeNotices.filter((notice) =>
    isCurrentDate(notice.startDate, notice.endDate)
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center border-b border-bg-secondary pb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {description && (
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Special Notices */}
      {currentNotices.length > 0 && (
        <div className="bg-secondary p-4 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">!</span>
              </div>
            </div>
            <div className="ml-3 space-y-2">
              {currentNotices.map((notice, index) => (
                <div key={index}>
                  {notice.title && (
                    <h3 className="text-sm font-medium">{notice.title}</h3>
                  )}
                  <p className="text-sm text-text-secondary">
                    {notice.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Meeting Information */}
      {meetingInfo?.hasMeetings && (
        <div className="bg-bg-secondary rounded-sm p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Meeting Information</h2>
          </div>
          <div className="space-y-2">
            {meetingInfo.schedule && (
              <p>
                <span className="font-medium">Schedule:</span>{" "}
                {meetingInfo.schedule}
              </p>
            )}
            {meetingInfo.time && (
              <p>
                <span className="font-medium">Time:</span> {meetingInfo.time}
              </p>
            )}
            {meetingInfo.location && (
              <p>
                <span className="font-medium">Location:</span>{" "}
                {meetingInfo.location}
              </p>
            )}
            {meetingInfo.additionalInfo && (
              <p className="mt-3">{meetingInfo.additionalInfo}</p>
            )}
          </div>
        </div>
      )}

      {/* Office Hours */}
      {officeHours?.hasHours && officeHours.hoursText && (
        <div className="bg-bg-secondary rounded-sm p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Hours</h2>
          </div>
          <p className="whitespace-pre-line">{officeHours.hoursText}</p>
        </div>
      )}

      {/* Members/Staff */}
      {activeMembers.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 mr-2" />
            <h2 className="text-2xl font-semibold">
              {groupType === "council"
                ? "Council Members"
                : groupType === "office"
                  ? "Staff"
                  : "Members"}
            </h2>
          </div>

          {displaySettings && (
            <div
              className={`grid gap-6 ${getGridCols(displaySettings.columnsPerRow)}`}
            >
              {activeMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-bg-secondary rounded-sm p-6 hover:shadow-lg transition-shadow"
                >
                  {displaySettings.showPhotos && member.photo && (
                    <div className="flex justify-center mb-4">
                      <img
                        src={member.photo.asset.url}
                        alt={member.photo.alt || `Photo of ${member.name}`}
                        className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                      />
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">
                      {member.name}
                    </h3>
                    <p className="text-text-secondary font-medium mb-3">
                      {member.role}
                    </p>

                    {member.bio && (
                      <p className="text-sm text-text-secondary mb-4">
                        {member.bio}
                      </p>
                    )}

                    {displaySettings.showContactInfo && (
                      <div className="space-y-2 text-sm">
                        {member.phone && (
                          <div className="flex items-center justify-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <span>
                              {formatPhoneNumber(
                                member.phone,
                                member.extension
                              )}
                            </span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center justify-center">
                            <Mail className="w-4 h-4 mr-2" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-text-hover transition-colors"
                            >
                              {member.email}
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {(member.termStart || member.termEnd) && (
                      <div className="mt-3 pt-3">
                        <p className="text-xs">
                          Term:{" "}
                          {member.termStart
                            ? new Date(member.termStart).getFullYear()
                            : "?"}{" "}
                          -{" "}
                          {member.termEnd
                            ? new Date(member.termEnd).getFullYear()
                            : "Present"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      {contactInfo && Object.values(contactInfo).some((v) => v) && (
        <div className="bg-bg-secondary rounded-sm p-6">
          <div className="flex items-center mb-4">
            <MapPin className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Contact Information</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {contactInfo.address && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Address</h3>
                  <p className="whitespace-pre-line">{contactInfo.address}</p>
                </div>
              )}

              {contactInfo.mailingAddress && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Mailing Address</h3>
                  <p className="whitespace-pre-line">
                    {contactInfo.mailingAddress}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {contactInfo.mainPhone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-text-secondary">
                    {contactInfo.mainPhone}
                  </span>
                </div>
              )}

              {contactInfo.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-text-hover transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              )}

              {contactInfo.fax && (
                <div>
                  <span className="text-sm">Fax: </span>
                  <span>{contactInfo.fax}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Content Blocks */}
      {additionalContent.length > 0 && (
        <div className="space-y-6">
          {additionalContent
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((block, index) => (
              <div key={index} className="bg-bg-secondary rounded-sm  p-6">
                {block.title && (
                  <h3 className="text-xl font-semibold mb-3">{block.title}</h3>
                )}
                <p className="whitespace-pre-line">{block.content}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
