import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Button,
  Stack,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
const BASE = process.env.REACT_APP_API_URL;

export default function ApplicationsManagePage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);

  // Фільтри
  const [statusFilter, setStatusFilter] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [searchName, setSearchName] = useState('');
const statusMap = {
  pending : 'Очікує',
  accepted: 'Прийнято',
  rejected: 'Відхилено',
};
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(`${BASE}/api/volunteers/applications/all`, {
          withCredentials: true,
        });

        setApplications(res.data.applications);
        setFilteredApps(res.data.applications);

        // Витягуємо список унікальних подій
        const uniqueEvents = [
          ...new Map(
            res.data.applications.map((app) => [app.event._id, app.event])
          ).values(),
        ];
        setEventOptions(uniqueEvents);
      } catch (err) {
        console.error('Помилка при завантаженні заявок:', err);
      }
    };

    fetchApplications();
  }, []);

  // Фільтрація
  useEffect(() => {
    let filtered = [...applications];

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (eventFilter) {
      filtered = filtered.filter((app) => app.event._id === eventFilter);
    }

    if (searchName) {
      filtered = filtered.filter((app) =>
      (app.volunteer?.name || '')
   .toLowerCase()
   .includes(searchName.toLowerCase())
     );
    }

    setFilteredApps(filtered);
  }, [statusFilter, eventFilter, searchName, applications]);

  // Обробка оновлення статусу заявки
  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${BASE}/api/volunteers/applications/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      // Оновити локальний стан, щоб одразу побачити зміни
      setApplications((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error('Помилка оновлення статусу:', error);
      alert('Не вдалося оновити статус. Спробуйте пізніше.');
    }
  };

  const columns = [
  {
    field: 'volunteerName',          // ← вигадане поле
    headerName: 'Волонтер',
    flex: 1,
    sortable: false,
    renderCell: ({ row }) =>
      row.volunteer ? (
        <Link
          to={`../../volunteer/${row.volunteer._id}`}
          style={{ textDecoration: 'none' }}
        >
          {row.volunteer.name}
        </Link>
      ) : '—',
  },
  {
    field: 'eventTitle',             // ← вигадане поле
    headerName: 'Подія',
    flex: 1,
    sortable: false,
    renderCell: ({ row }) =>
      row.event ? (
        <Link
          to={`../../event/${row.event._id}`}
          style={{ textDecoration: 'none' }}
        >
          {row.event.title}
        </Link>
      ) : '—',
  },
  {
    field: 'message',
    headerName: 'Повідомлення',
    flex: 2,
  },
  {
    field: 'status',
    headerName: 'Статус',
    flex: 1,
  },
  {
    field: 'createdAt',
    headerName: 'Дата',
    flex: 1,
    valueGetter: (p) =>
      p?.row?.createdAt ? dayjs(p.row.createdAt).format('DD.MM.YYYY') : '',
  },
  {
    field: 'actions',
    headerName: 'Дії',
    flex: 1,
    sortable: false,
    filterable: false,
    renderCell: (p) => (
      <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            disabled={p.row.status === 'accepted'}
            onClick={() => updateStatus(p.row._id, 'accepted')}
          >
            Прийняти
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            disabled={p.row.status === 'rejected'}
            onClick={() => updateStatus(p.row._id, 'rejected')}
          >
            Відхилити
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Заявки волонтерів на всі події
      </Typography>

      {/* Фільтри */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Пошук за ім’ям"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
             <MenuItem value="">Всі</MenuItem>
  {Object.entries(statusMap).map(([code, ui]) => (
    <MenuItem key={code} value={code}>
      {ui}
    </MenuItem>
  ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Подія</InputLabel>
          <Select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            label="Подія"
          >
            <MenuItem value="">Всі</MenuItem>
            {eventOptions.map((e) => (
              <MenuItem key={e._id} value={e._id}>
                {e.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Таблиця */}
      <Paper>
        <DataGrid
          rows={filteredApps}
          getRowId={(r) => r._id} 
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20]}
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
}
