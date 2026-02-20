import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Chip,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Fade,
  Slide,
  Fab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  Tooltip,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Receipt as ReceiptIcon,
  Calculate as CalculateIcon,
  Percent as PercentIcon,
  Group as GroupIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ContentCopy as ContentCopyIcon,
  EmojiEmotions as CuteIcon,
  SportsEsports as GamerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'

const STORAGE_KEY = 'vibe-split-data'

function App({ themeMode, onToggleTheme }) {
  const [members, setMembers] = useState([])
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: 1,
    type: 'item',
    hasQuantity: false,
    participants: [],
  })
  const [showAddItem, setShowAddItem] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [lastParticipants, setLastParticipants] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setMembers(data.members || [])
        setItems(data.items || [])
        if (data.items && data.items.length > 0) {
          const lastItem = data.items[data.items.length - 1]
          if (lastItem.type === 'item') {
            setLastParticipants(lastItem.participants || [])
          }
        }
      } catch (e) {
        console.error('Failed to load data', e)
      }
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, items }))
    }
  }, [members, items, loaded])

  useEffect(() => {
    if (loaded) {
      const memberIds = new Set(members.map(m => m.id))
      setItems(prev => prev.map(item => ({
        ...item,
        participants: item.participants.filter(p => memberIds.has(p))
      })))
      setLastParticipants(prev => prev.filter(p => memberIds.has(p)))
    }
  }, [members, loaded])

  const resetAll = useCallback(() => {
    if (window.confirm('Start over? This will clear all members and items.')) {
      setMembers([])
      setItems([])
      setNewMemberName('')
      setNewItem({
        name: '',
        price: '',
        quantity: 1,
        type: 'item',
        hasQuantity: false,
        participants: [],
      })
    }
  }, [])

  const addMember = useCallback(() => {
    if (newMemberName.trim()) {
      setMembers(prev => [...prev, { id: Date.now(), name: newMemberName.trim() }])
      setNewMemberName('')
    }
  }, [newMemberName])

  const removeMember = useCallback((id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
    setItems(prev => {
      const newItems = prev.map(item => ({
        ...item,
        participants: item.participants.filter(p => p !== id)
      }))
      return newItems
    })
    setLastParticipants(prev => prev.filter(p => p !== id))
  }, [])

  const addItem = useCallback(() => {
    if (newItem.name.trim() && newItem.price) {
      const itemParticipants = newItem.type === 'item' 
        ? (newItem.participants.length > 0 ? newItem.participants : lastParticipants.length > 0 ? lastParticipants : members.map(m => m.id))
        : members.map(m => m.id)
      
      const item = {
        id: Date.now(),
        name: newItem.name.trim(),
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity) || 1,
        hasQuantity: newItem.hasQuantity || false,
        type: newItem.type,
        participants: itemParticipants,
      }
      setItems(prev => [...prev, item])
      setLastParticipants(itemParticipants)
      setNewItem({
        name: '',
        price: '',
        quantity: 1,
        type: 'item',
        hasQuantity: false,
        participants: [],
      })
      setShowAddItem(false)
    }
  }, [newItem, members, lastParticipants])

  const updateItem = useCallback((id, updates) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }, [])

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }, [])

  const toggleParticipant = useCallback((itemId, memberId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const hasParticipant = item.participants.includes(memberId)
        return {
          ...item,
          participants: hasParticipant
            ? item.participants.filter(p => p !== memberId)
            : [...item.participants, memberId]
        }
      }
      return item
    }))
  }, [])

  const selectAllParticipants = useCallback((itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, participants: members.map(m => m.id) }
      }
      return item
    }))
  }, [members])

  const deselectAllParticipants = useCallback((itemId) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, participants: [] }
      }
      return item
    }))
  }, [])

  const calculateSplit = useCallback(() => {
    const subtotal = items
      .filter(item => item.type === 'item')
      .reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const percentageItems = items.filter(item => item.type === 'percentage')

    const percentageTotal = percentageItems.reduce((sum, item) => {
      return sum + (subtotal * item.price / 100)
    }, 0)

    const total = subtotal + percentageTotal

    const memberTotals = {}
    members.forEach(member => {
      memberTotals[member.id] = 0
    })

    items.filter(item => item.type === 'item').forEach(item => {
      if (item.participants.length > 0) {
        const share = (item.price * item.quantity) / item.participants.length
        item.participants.forEach(participantId => {
          if (memberTotals[participantId] !== undefined) {
            memberTotals[participantId] += share
          }
        })
      }
    })

    const percentagePerMember = {}
    members.forEach(member => {
      percentagePerMember[member.id] = 0
    })

    if (subtotal > 0 && members.length > 0) {
      percentageItems.forEach(item => {
        const memberShare = item.price / 100
        members.forEach(member => {
          if (memberTotals[member.id] > 0) {
            const proportion = memberTotals[member.id] / subtotal
            percentagePerMember[member.id] += subtotal * memberShare * proportion
          }
        })
      })
    }

    const finalTotals = {}
    members.forEach(member => {
      finalTotals[member.id] = memberTotals[member.id] + percentagePerMember[member.id]
    })

    return { subtotal, percentageTotal, total, memberTotals: finalTotals }
  }, [items, members])

  const split = calculateSplit()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const copySummary = () => {
    const lines = ['📊 Vibe Split Summary', '']
    members.forEach(member => {
      lines.push(`${member.name}: ${formatCurrency(split.memberTotals[member.id])}`)
    })
    lines.push('')
    lines.push(`Subtotal: ${formatCurrency(split.subtotal)}`)
    lines.push(`Total: ${formatCurrency(split.total)}`)
    navigator.clipboard.writeText(lines.join('\n'))
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 5, position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Start over">
                <IconButton onClick={resetAll} size="small" sx={{ color: 'text.secondary' }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <ToggleButtonGroup
                value={themeMode}
                exclusive
                onChange={onToggleTheme}
                size="small"
                sx={{
                  '& .MuiToggleButton-root': {
                    border: '1px solid',
                    borderColor: 'divider',
                    px: 1.5,
                    py: 0.5,
                  },
                }}
              >
                <ToggleButton value="cute" sx={{ gap: 0.5 }}>
                  <CuteIcon fontSize="small" />
                  <Typography variant="caption">Cute</Typography>
                </ToggleButton>
                <ToggleButton value="gamer" sx={{ gap: 0.5 }}>
                  <GamerIcon fontSize="small" />
                  <Typography variant="caption">Gamer</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            <Typography
              variant="h1"
              sx={{
                background: themeMode === 'cute'
                  ? 'linear-gradient(135deg, #8FC9B0 0%, #6AB394 100%)'
                  : 'linear-gradient(135deg, #BB86FC 0%, #03DAC6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: themeMode === 'cute'
                  ? '0 0 30px rgba(143, 201, 176, 0.4)'
                  : '0 0 40px rgba(187, 134, 252, 0.3)',
                mb: 1,
              }}
            >
              Vibe Split
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Split bills with your crew
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <GroupIcon sx={{ color: 'primary.main' }} />
                  <Typography variant="h3">Members</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add member..."
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addMember()}
                  />
                  <IconButton color="primary" onClick={addMember}>
                    <PersonAddIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {members.length === 0 ? (
                    <Typography variant="caption" color="text.disabled">
                      Add members to get started
                    </Typography>
                  ) : (
                    members.map(member => (
                      <Chip
                        key={member.id}
                        avatar={<Avatar sx={{ bgcolor: 'primary.main' }}>{member.name[0].toUpperCase()}</Avatar>}
                        label={member.name}
                        onDelete={() => removeMember(member.id)}
                        sx={{
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      />
                    ))
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ReceiptIcon sx={{ color: 'secondary.main' }} />
              <Typography variant="h3">Items</Typography>
            </Box>

            {items.length === 0 && !showAddItem ? (
              <Card sx={{ textAlign: 'center', py: 6 }}>
                <ReceiptIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No items yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setNewItem({
                      ...newItem,
                      participants: lastParticipants.length > 0 ? lastParticipants : members.map(m => m.id),
                    })
                    setShowAddItem(true)
                  }}
                >
                  Add First Item
                </Button>
              </Card>
            ) : (
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map((item, index) => (
                  <Slide direction="up" in key={item.id} timeout={300 + index * 100}>
                    <Card>
                      {editingItemId === item.id ? (
                        <CardContent>
                          <Typography variant="h3" gutterBottom>Edit Item</Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Item Name"
                                value={item.name}
                                onChange={(e) => {
                                  const updated = items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i)
                                  setItems(updated)
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 3 }}>
                              <TextField
                                fullWidth
                                label={item.type === 'percentage' ? 'Percentage' : 'Price'}
                                type="number"
                                value={item.price}
                                onChange={(e) => {
                                  const updated = items.map(i => i.id === item.id ? { ...i, price: parseFloat(e.target.value) || 0 } : i)
                                  setItems(updated)
                                }}
                                InputProps={{
                                  startAdornment: item.type === 'item' ? <InputAdornment position="start">$</InputAdornment> : null,
                                  endAdornment: item.type === 'percentage' ? <InputAdornment position="end">%</InputAdornment> : null,
                                }}
                              />
                            </Grid>
                            {item.type === 'item' && (
                              <>
                                <Grid size={{ xs: 12 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="caption" color="text.secondary">Multi-qty</Typography>
                                    <Switch
                                      size="small"
                                      checked={item.hasQuantity !== false}
                                      onChange={(e) => {
                                        const updated = items.map(i => i.id === item.id ? { ...i, hasQuantity: e.target.checked } : i)
                                        setItems(updated)
                                      }}
                                    />
                                    {item.hasQuantity !== false && (
                                      <TextField
                                        size="small"
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => {
                                          const updated = items.map(i => i.id === item.id ? { ...i, quantity: parseInt(e.target.value) || 1 } : i)
                                          setItems(updated)
                                        }}
                                        inputProps={{ min: 1 }}
                                        sx={{ width: 80 }}
                                      />
                                    )}
                                  </Box>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                    Participants
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {members.map(member => (
                                      <Chip
                                        key={member.id}
                                        label={member.name}
                                        onClick={() => {
                                          const updated = items.map(i => {
                                            if (i.id === item.id) {
                                              const hasParticipant = i.participants.includes(member.id)
                                              return {
                                                ...i,
                                                participants: hasParticipant
                                                  ? i.participants.filter(p => p !== member.id)
                                                  : [...i.participants, member.id]
                                              }
                                            }
                                            return i
                                          })
                                          setItems(updated)
                                        }}
                                        variant={item.participants.includes(member.id) ? 'filled' : 'outlined'}
                                        sx={{
                                          cursor: 'pointer',
                                          backgroundColor: item.participants.includes(member.id)
                                            ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                            : 'transparent',
                                          color: item.participants.includes(member.id) ? '#FFFFFF' : 'text.secondary',
                                          borderColor: item.participants.includes(member.id)
                                            ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                            : 'divider',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Grid>
                              </>
                            )}
                          </Grid>
                          <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                            <Button variant="contained" onClick={() => setEditingItemId(null)}>
                              Done
                            </Button>
                            <Button variant="outlined" color="error" onClick={() => {
                              deleteItem(item.id)
                              setEditingItemId(null)
                            }}>
                              Delete
                            </Button>
                          </Box>
                        </CardContent>
                      ) : (
                        <CardContent>
                          <Box 
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, cursor: 'pointer' }}
                            onClick={() => setEditingItemId(item.id)}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.type === 'percentage' ? (
                                <PercentIcon sx={{ color: 'secondary.main' }} />
                              ) : (
                                <ReceiptIcon sx={{ color: 'primary.main' }} />
                              )}
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {item.name}
                                </Typography>
                                {item.type !== 'item' && (
                                  <Typography variant="caption" color="text.secondary">
                                    {item.type === 'percentage' ? `${item.price}%` : 'Fixed'}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.type === 'item' && item.hasQuantity !== false && item.quantity > 1 && (
                                <Chip label={`×${item.quantity}`} size="small" color="primary" variant="outlined" />
                              )}
                              <Typography
                                variant="h3"
                                sx={{
                                  fontFamily: '"JetBrains Mono", monospace',
                                  color: 'primary.main',
                                }}
                              >
                                {formatCurrency(item.type === 'percentage' 
                                  ? split.subtotal * item.price / 100 
                                  : item.price * item.quantity)}
                              </Typography>
                              <IconButton size="small" onClick={(e) => { e.stopPropagation(); deleteItem(item.id) }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>

                          {item.type === 'item' && item.hasQuantity !== false && (
                            <>
                              <Divider sx={{ my: 2 }} />
                              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                Split between {item.participants.length} {item.participants.length === 1 ? 'person' : 'people'}
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => selectAllParticipants(item.id)}
                                >
                                  All
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => deselectAllParticipants(item.id)}
                                >
                                  None
                                </Button>
                                {members.map(member => (
                                  <Chip
                                    key={member.id}
                                    label={member.name}
                                    size="small"
                                    onClick={() => toggleParticipant(item.id, member.id)}
                                    variant={item.participants.includes(member.id) ? 'filled' : 'outlined'}
                                    sx={{
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      opacity: item.participants.includes(member.id) ? 1 : 0.4,
                                      backgroundColor: item.participants.includes(member.id)
                                        ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                        : 'transparent',
                                      color: item.participants.includes(member.id) ? '#FFFFFF' : 'text.secondary',
                                      borderColor: item.participants.includes(member.id)
                                        ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                        : 'divider',
                                      '&:hover': {
                                        backgroundColor: item.participants.includes(member.id)
                                          ? (themeMode === 'cute' ? '#D67D8A' : '#9A67EA')
                                          : 'action.hover',
                                      },
                                    }}
                                  />
                                ))}
                              </Box>
                              {item.participants.length === 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: 'warning.main' }}>
                                  <WarningIcon fontSize="small" />
                                  <Typography variant="caption" color="warning.main">
                                  Select at least one person
                                </Typography>
                              </Box>
                            )}
                          </>
                        )}
                      </CardContent>
                      )}
                    </Card>
                  </Slide>
                ))}
              </List>
            )}

            {showAddItem && (
              <Fade in>
                <Card sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>Add New Item</Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Item Name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 3 }}>
                        <FormControl fullWidth>
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={newItem.type}
                            label="Type"
                            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                          >
                            <MenuItem value="item">Item</MenuItem>
                            <MenuItem value="percentage">Tip / Tax</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      {newItem.type === 'item' ? (
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                          />
                        </Grid>
                      ) : (
                        <Grid size={{ xs: 12, sm: 3 }}>
                          <TextField
                            fullWidth
                            label="Percentage"
                            type="number"
                            value={newItem.price}
                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                          />
                        </Grid>
                      )}
                      {newItem.type === 'item' && (
                        <Grid size={{ xs: 12 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="caption" color="text.secondary">
                              Multi-qty
                            </Typography>
                            <Switch
                              size="small"
                              checked={newItem.hasQuantity || false}
                              onChange={(e) => setNewItem({ ...newItem, hasQuantity: e.target.checked, quantity: e.target.checked ? (newItem.quantity || 1) : 1 })}
                            />
                            {newItem.hasQuantity && (
                              <TextField
                                size="small"
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                inputProps={{ min: 1 }}
                                sx={{ width: 80 }}
                              />
                            )}
                          </Box>
                        </Grid>
                      )}
                      {newItem.type === 'item' && (
                        <Grid size={{ xs: 12 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Participants (who splits this item)
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {members.length === 0 ? (
                              <Typography variant="caption" color="text.disabled">
                                Add members first
                              </Typography>
                            ) : (
                              members.map(member => (
                                <Chip
                                  key={member.id}
                                  label={member.name}
                                  onClick={() => {
                                    const isSelected = newItem.participants.includes(member.id)
                                    setNewItem({
                                      ...newItem,
                                      participants: isSelected
                                        ? newItem.participants.filter(p => p !== member.id)
                                        : [...newItem.participants, member.id]
                                    })
                                  }}
                                  variant={newItem.participants.includes(member.id) ? 'filled' : 'outlined'}
                                  sx={{
                                    cursor: 'pointer',
                                    backgroundColor: newItem.participants.includes(member.id)
                                      ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                      : 'transparent',
                                    color: newItem.participants.includes(member.id)
                                      ? '#FFFFFF'
                                      : 'text.secondary',
                                    borderColor: newItem.participants.includes(member.id)
                                      ? (themeMode === 'cute' ? '#E89AA8' : '#BB86FC')
                                      : 'divider',
                                    '&:hover': {
                                      backgroundColor: newItem.participants.includes(member.id)
                                        ? (themeMode === 'cute' ? '#D67D8A' : '#9A67EA')
                                        : 'action.hover',
                                    },
                                  }}
                                />
                              ))
                            )}
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                    <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                      <Button variant="contained" onClick={addItem} startIcon={<AddIcon />}>
                        Add Item
                      </Button>
                      <Button variant="outlined" onClick={() => setShowAddItem(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            )}

            {!showAddItem && items.length > 0 && (
              <Fab
                color="primary"
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 4px 20px rgba(187, 134, 252, 0.4)',
                }}
                onClick={() => {
                  setNewItem({
                    ...newItem,
                    participants: lastParticipants.length > 0 ? lastParticipants : members.map(m => m.id),
                  })
                  setShowAddItem(true)
                }}
              >
                <AddIcon />
              </Fab>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 3 }}>
            <Card sx={{ position: 'sticky', top: 20 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CalculateIcon sx={{ color: 'secondary.main' }} />
                  <Typography variant="h3">Summary</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {formatCurrency(split.subtotal)}
                    </Typography>
                  </Box>
                  {split.percentageTotal > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Tax & Tips</Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'secondary.main' }}
                      >
                        {formatCurrency(split.percentageTotal)}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight={600}>Total</Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        color: 'primary.main',
                      }}
                    >
                      {formatCurrency(split.total)}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Per Person
                </Typography>

                <List dense disablePadding>
                  {members.length === 0 ? (
                    <Typography variant="caption" color="text.disabled">
                      Add members to see breakdown
                    </Typography>
                  ) : (
                    members.map(member => (
                      <ListItem
                        key={member.id}
                        sx={{
                          px: 0,
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(187, 134, 252, 0.1)',
                            borderRadius: 1,
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {member.name[0].toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member.name}
                          secondary={split.memberTotals[member.id] > 0 
                            ? `${formatCurrency(split.memberTotals[member.id])}`
                            : 'Nothing owed'}
                        />
                        {split.memberTotals[member.id] > 0 && (
                          <CheckCircleIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
                        )}
                      </ListItem>
                    ))
                  )}
                </List>

                {members.length > 0 && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ContentCopyIcon />}
                    onClick={copySummary}
                    sx={{ mt: 2 }}
                  >
                    Copy Summary
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default App
