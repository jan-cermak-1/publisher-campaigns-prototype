import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useCampaignsStore } from '../../store/campaignsStore';
import { usePostsStore } from '../../store/postsStore';
import { useUIStore } from '../../store/uiStore';
import type { Campaign, Post } from '../../types';

const CalendarContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.base};

  /* FullCalendar custom styling */
  .fc {
    font-family: ${({ theme }) => theme.typography.fontFamily.sans};
  }

  .fc .fc-button-primary {
    background-color: ${({ theme }) => theme.colors.primary[500]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary[600]};
      border-color: ${({ theme }) => theme.colors.primary[600]};
    }
    
    &:disabled {
      background-color: ${({ theme }) => theme.colors.neutral[300]};
      border-color: ${({ theme }) => theme.colors.neutral[300]};
    }
  }

  .fc .fc-button-active {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }

  .fc-theme-standard td,
  .fc-theme-standard th {
    border-color: ${({ theme }) => theme.colors.neutral[200]};
  }

  .fc-col-header-cell {
    background-color: ${({ theme }) => theme.colors.neutral[50]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.neutral[700]};
    text-transform: uppercase;
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    padding: ${({ theme }) => theme.spacing[3]};
  }

  .fc-daygrid-day-number {
    color: ${({ theme }) => theme.colors.neutral[700]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    padding: ${({ theme }) => theme.spacing[2]};
  }

  .fc-daygrid-day.fc-day-today {
    background-color: ${({ theme }) => theme.colors.primary[50]} !important;
  }

  .fc-event {
    border: none;
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      filter: brightness(0.95);
      transform: scale(1.02);
    }
  }

  .fc-event-title {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  .fc-timegrid-slot {
    height: 40px;
  }

  .fc-timegrid-event {
    border-left-width: 4px !important;
  }
`;

const CampaignEvent = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  color: white;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostEvent = styled.div<{ campaignColor?: string }>`
  background-color: ${({ theme }) => theme.colors.neutral.white};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  ${({ campaignColor }) => campaignColor && `border-left: 4px solid ${campaignColor};`}
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

interface CalendarViewProps {
  onDateSelect?: (start: Date, end: Date) => void;
  onEventClick?: (event: any) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onDateSelect, onEventClick }) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { campaigns } = useCampaignsStore();
  const { posts } = usePostsStore();
  const { calendarView } = useUIStore();

  useEffect(() => {
    // Change calendar view when UI store updates
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const viewMap = {
        month: 'dayGridMonth',
        week: 'timeGridWeek',
        day: 'timeGridDay',
        agenda: 'timeGridWeek', // Can be customized later
      };
      calendarApi.changeView(viewMap[calendarView]);
    }
  }, [calendarView]);

  // Convert campaigns to calendar events
  const campaignEvents = campaigns.map((campaign: Campaign) => ({
    id: campaign.id,
    title: campaign.name,
    start: campaign.startDate,
    end: campaign.endDate,
    allDay: true,
    backgroundColor: campaign.color,
    borderColor: campaign.color,
    extendedProps: {
      type: 'campaign',
      campaign,
    },
    classNames: ['campaign-event'],
  }));

  // Convert posts to calendar events
  const postEvents = posts.map((post: Post) => {
    const campaign = campaigns.find((c: Campaign) => c.id === post.campaignId);
    return {
      id: post.id,
      title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
      start: post.publishDate,
      backgroundColor: campaign ? campaign.color : '#9CA3AF',
      borderColor: campaign ? campaign.color : '#9CA3AF',
      extendedProps: {
        type: 'post',
        post,
        campaign,
      },
      classNames: ['post-event'],
    };
  });

  const allEvents = [...campaignEvents, ...postEvents];

  const handleDateClick = (arg: any) => {
    console.log('Date clicked:', arg.dateStr);
  };

  const handleSelect = (selectInfo: any) => {
    if (onDateSelect) {
      onDateSelect(selectInfo.start, selectInfo.end);
    }
    // Open quick create campaign modal
    useUIStore.getState().setQuickCreateCampaignOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const { type, campaign, post } = clickInfo.event.extendedProps;
    
    if (onEventClick) {
      onEventClick(clickInfo.event);
    }

    if (type === 'campaign') {
      useCampaignsStore.getState().selectCampaign(campaign.id);
      useUIStore.getState().setCampaignDetailOpen(true);
    } else if (type === 'post') {
      usePostsStore.getState().selectPost(post.id);
      // Could open post detail modal here
    }
  };

  const handleEventDrop = (dropInfo: any) => {
    const { type, campaign, post } = dropInfo.event.extendedProps;
    
    if (type === 'campaign') {
      useCampaignsStore.getState().saveCampaign(campaign.id, {
        startDate: dropInfo.event.start.toISOString(),
        endDate: dropInfo.event.end ? dropInfo.event.end.toISOString() : dropInfo.event.start.toISOString(),
      });
    } else if (type === 'post') {
      usePostsStore.getState().savePost(post.id, {
        publishDate: dropInfo.event.start.toISOString(),
      });
    }
  };

  const handleEventResize = (resizeInfo: any) => {
    const { type, campaign } = resizeInfo.event.extendedProps;
    
    if (type === 'campaign') {
      useCampaignsStore.getState().saveCampaign(campaign.id, {
        startDate: resizeInfo.event.start.toISOString(),
        endDate: resizeInfo.event.end ? resizeInfo.event.end.toISOString() : resizeInfo.event.start.toISOString(),
      });
    }
  };

  return (
    <CalendarContainer>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={allEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        dateClick={handleDateClick}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={true}
        nowIndicator={true}
        eventContent={renderEventContent}
      />
    </CalendarContainer>
  );
};

// Custom event rendering
function renderEventContent(eventInfo: any) {
  const { type, campaign } = eventInfo.event.extendedProps;
  
  if (type === 'campaign') {
    return (
      <CampaignEvent color={eventInfo.event.backgroundColor}>
        {eventInfo.event.title}
      </CampaignEvent>
    );
  }
  
  return (
    <PostEvent campaignColor={campaign?.color}>
      <div style={{ fontWeight: 500 }}>{eventInfo.timeText}</div>
      <div>{eventInfo.event.title}</div>
    </PostEvent>
  );
}

